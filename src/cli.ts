import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import chalk from 'chalk'
import axios from 'axios'
import os from 'os'
import * as Github from './lib/github'
import * as fsAsync from './lib/fsAsync'
import fileType from './lib/fileType'
import Repository from './ts/Repository'
import Commit from './ts/Commit'

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

        let checkedRepositories
        while (true) {
            checkedRepositories = (await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'checkedRepositories',
                    message: 'Select the repositories where you want to get the commits',
                    choices: repositories.map((repo: Repository) => {
                        if (repo.full_name.includes(login)) return repo.name
                        else return repo.full_name
                    }),
                    pageSize: 15
                }
            ])).checkedRepositories

            if (Array.isArray(checkedRepositories) && checkedRepositories.length === 0) continue
            break
        }

        const { isNotFixed } =  await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isNotFixed',
                message: 'The default branch is master. Would you like to change to another branch?',
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
                    branches = await Github.getBranch(token, login, repo)
                } catch (err) {}

                if (branches) {
                    const { defaultBranch } = await inquirer.prompt([
                        {
                            type: 'rawlist',
                            name: 'defaultBranch',
                            message: 'Choose one branch that will be the default branch',
                            choices: branches,
                            pageSize: 15
                        }
                    ])

                    repositoryBranchMap[repo] = defaultBranch
                }
            }
        }

        const commitMap: { [key: string]: Commit[] } = {}
        for (let i = 0; i < checkedRepositories.length; i++) {
            const repo = checkedRepositories[i]

            let commits
            try {
                commits = await Github.getCommit(token, login, repo, repositoryBranchMap[repo] || 'master')
            } catch (err) {}

            if (Array.isArray(commits) && commits.length > 0) {
                console.log(chalk.bgMagenta(`Got the ${commits.length} commits from <${repo}> repository!`))
                commitMap[repo] = commits
            }
            else {
                return null
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

        switch (fileType[selectedFileType]) {
            case '.md':
                for (let i = 0; i < checkedRepositories.length; i++) {
                    const repo = checkedRepositories[i]

                    data += `# ${repo}(branch: ${repositoryBranchMap[repo] || 'master'})${os.EOL}`
                    const commits = commitMap[repo]
                    if (Array.isArray(commits) && commits.length > 0) {
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]
                            data += `- ${commit.commit.message}${os.EOL}`
                        }
                    }
                }
                break
            case '.html':
                data += `<!doctype html>${os.EOL}`
                data += `<html>${os.EOL}`
                data += `  <head>${os.EOL}    <title>Get my commit</title>${os.EOL}  </head>${os.EOL}`
                data += `  <body></body>`
                data += '</html>'
                let subData = ''
                for (let i = 0; i < checkedRepositories.length; i++) {
                    const repo = checkedRepositories[i]
                    subData += `    <h1>${repo}(branch: ${repositoryBranchMap[repo] || 'master'})</h1>${os.EOL}`
                    const commits = commitMap[repo]
                    if (Array.isArray(commits) && commits.length > 0) {
                        subData += `    <ul>${os.EOL}`
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]
                            subData += `      <li>${commit.commit.message}</li>${os.EOL}`
                        }
                        subData += `    </ul>${os.EOL}`
                    }
                }
                data = data.replace('<body></body>', `<body>${os.EOL}${subData}</body>${os.EOL}`)
                break
        }

        await fsAsync.writeFileSync(`${__dirname}/../get_my_commit${fileType[selectedFileType]}`, data)

        console.log(chalk.bgMagenta(`get_my_commit${fileType[selectedFileType]} file was saved successfully`))
    } catch (err) {
        chalk.red.bold(console.error(err))
    }
}