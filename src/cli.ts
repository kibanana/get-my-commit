import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import chalk from 'chalk'
import axios from 'axios'
import os from 'os'
import * as Github from './lib/github'
import * as fsAsync from './lib/fsAsync'
import fileType from './lib/fileType'
import Commit from './ts/Commit'
import Repository from './ts/Repository'

export default async () => {
    try {
        const { token } = await inquirer.prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Enter Personal access token(Github - Settings - Developer settings):'
            }
        ])

        let user
        try {
            user = await Github.getProfile(token)
        } catch (err) {}

        if (!user) return null

        console.log(chalk.bgMagenta('Got a profile!'))

        const {
            login,
            id: userId,
            avatar_url,
            url,
            name,
            bio,
            public_repos,
            total_private_repos
        } = user
        let { created_at: createdAt, updated_at: updatedAt } = user
        createdAt = new Date(createdAt).toISOString().substr(0, 10).replace(/-/g, '.')
        updatedAt = new Date(updatedAt).toISOString().substr(0, 10).replace(/-/g, '.')

        const responseImage = (await axios.get(avatar_url, { responseType: 'arraybuffer' }))
        const image = Buffer.from(responseImage.data, 'binary')

        console.log(await terminalImage.buffer(image, { width: '50%', height: '50%' }))
        console.log(chalk.magenta(`[${url}]`))
        console.log(chalk.magenta(`${name} (${login})`))
        console.log(chalk.magenta(`Bio: ${bio}`))
        console.log(chalk.magenta(`Repositories: ${public_repos} public repos & ${total_private_repos} private repos`))
        console.log(chalk.magenta(`Updated at ${updatedAt}`))
        console.log(chalk.magenta(`Created at ${createdAt}`))

        const { isCorrectUser } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isCorrectUser',
                message: 'Is this profile yours?'
            }
        ])

        if (!isCorrectUser) return null

        let repositories
        try {
            repositories = await Github.getRepository(token)
        } catch (err) {}

        if (!repositories) return null

        console.log(chalk.bgMagenta(`Got the ${repositories.length} repositories!`))

        const repositoryMap: { [key: string]: Repository } = {}
        for (let i = 0; i < repositories.length; i++) {
            const repository = repositories[i]

            if (repository.owner.id === userId) repositoryMap[repository.name] = repository
            else repositoryMap[repository.full_name] = repository
        }

        let checkedRepositories
        while (true) {
            checkedRepositories = (await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'checkedRepositories',
                    message: 'Select the repositories where you want to get the commits',
                    choices: Object.keys(repositoryMap),
                    pageSize: 15
                }
            ])).checkedRepositories

            if (Array.isArray(checkedRepositories) && checkedRepositories.length !== 0) break
        }

        const { isNotFixed } =  await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isNotFixed',
                message: 'It will use default branch. Would you like to change to another branch?',
            }
        ])

        const repositoryBranchMap: { [key: string]: string } = {}
        if (isNotFixed && Array.isArray(checkedRepositories) && checkedRepositories.length > 0) {
            let changedRepositories
            while (true) {
                changedRepositories = (await inquirer.prompt([
                    {
                        type: 'checkbox',
                        name: 'changedRepositories',
                        message: 'Select the repositories where you want to change branch',
                        choices: checkedRepositories,
                        pageSize: 15
                    }
                ])).changedRepositories

                if (Array.isArray(changedRepositories) && changedRepositories.length === 0) continue
                break
            }

            for (let i = 0; i < changedRepositories.length; i++) {
                const repo = changedRepositories[i]

                let branches
                try {
                    branches = await Github.getBranch(token, repositoryMap[repo].full_name)
                } catch (err) {}

                if (branches) {
                    const { branch } = await inquirer.prompt([
                        {
                            type: 'rawlist',
                            name: 'branch',
                            message: `Choose one branch that will be the default branch (${repo})`,
                            choices: branches,
                            pageSize: 15
                        }
                    ])

                    repositoryBranchMap[repo] = branch
                }
            }
        }

        const commitMap: { [key: string]: Commit[] } = {}
        let commits
        for (let i = 0; i < checkedRepositories.length; i++) {
            commits = null
            const repo = checkedRepositories[i]

            try {
                commits = await Github.getCommit(token, repositoryMap[repo].full_name, repositoryBranchMap[repo] || repositoryMap[repo].default_branch)
            } catch (err) {}

            if (Array.isArray(commits) && commits.length > 0) {
                commits = commits.filter((commit) => commit.author.id === userId || commit.committer.id === userId)
                console.log(chalk.bgMagenta(`Got the ${commits.length} commits from <${repo}> repository(${repositoryBranchMap[repo] || repositoryMap[repo].default_branch} branch)!`))
                commitMap[repo] = commits
            } else if (Array.isArray(commits) && commits.length === 0) {
                console.log(chalk.bgMagenta(`Got nothing(0 commit) from <${repo}> repository!`))
            }
        }

        const { selectedFileType } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'selectedFileType',
                message: 'Which file type would you like to extract?',
                choices: Object.keys(fileType)
            }
        ])

        let data = ''
        let subData = ''
        let subDataWithAdditionalData = ''

        const existedRepositories: string[] = Object.keys(commitMap)
        switch (fileType[selectedFileType]) {
            case '.md':
                for (let i = 0; i < existedRepositories.length; i++) {
                    const repo = existedRepositories[i]

                    data += `# ${repo}(branch: ${repositoryBranchMap[repo] || repositoryMap[repo].default_branch}, [link](${repositoryMap[repo].html_url}))${os.EOL}`
                    const commits = commitMap[repo]
                    if (Array.isArray(commits) && commits.length > 0) {
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]
                            const { commit: { message, author: { date: authorDate }, committer: { date: committerDate } }, html_url: htmlUrl } = commit
                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = new Date(commitDate).toISOString()
                            commitDate = `${commitDate.substr(0, 10).replace(/-/g, '.')} ${commitDate.substr(11, 8)}`
                            subData += `- ${message}${os.EOL}`
                            subDataWithAdditionalData += `- ${message} *(${commitDate}, [link](${htmlUrl}))*${os.EOL}${os.EOL}`
                        }
                    }
                    data += `${subData}<hr>${os.EOL}${os.EOL}${subDataWithAdditionalData}${os.EOL}`
                    subData = ''
                    subDataWithAdditionalData = ''
                }
                break
            case '.html':
                data += `<!doctype html>${os.EOL}`
                data += `<html>${os.EOL}`
                data += `  <head>${os.EOL}    <title>Get my commit</title>${os.EOL}  </head>${os.EOL}`
                data += `  <body></body>`
                data += '</html>'

                let temp = ''
                for (let i = 0; i < existedRepositories.length; i++) {
                    const repo = existedRepositories[i]
                    
                    subData = `    <h1>${repo}(branch: ${repositoryBranchMap[repo] || repositoryMap[repo].default_branch}, <a href=${repositoryMap[repo].html_url}>link</a>)</h1>${os.EOL}`

                    const commits = commitMap[repo]
                    if (Array.isArray(commits) && commits.length > 0) {
                        subData += `    <ul>${os.EOL}`
                        subDataWithAdditionalData += `    <ul>${os.EOL}`
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]
                            const { commit: { message, author: { date: authorDate }, committer: { date: committerDate } }, html_url: htmlUrl } = commit
                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = new Date(commitDate).toISOString()
                            commitDate = `${commitDate.substr(0, 10).replace(/-/g, '.')} ${commitDate.substr(11, 8)}`
                            subData += `      <li>${message}</li>${os.EOL}`
                            subDataWithAdditionalData += `      <li>${message} <i> (${commitDate}, <a link href=${htmlUrl}>link</a>)</li><i>${os.EOL}`
                        }
                        subData += `    </ul>${os.EOL}`
                        subDataWithAdditionalData += `    </ul>${os.EOL}`
                    }

                    temp += `${subData}<hr>${os.EOL}${subDataWithAdditionalData}`
                    subData = ''
                    subDataWithAdditionalData = ''
                }
                data = data.replace('<body></body>', `<body>${os.EOL}${temp}</body>${os.EOL}`)
                break
        }

        await fsAsync.writeFileSync(`${__dirname}/../get_my_commit${fileType[selectedFileType]}`, data)

        console.log(chalk.bgMagenta(`get_my_commit${fileType[selectedFileType]} file was saved successfully`))
    } catch (err) {
        chalk.red.bold(console.error(err))
    }
}