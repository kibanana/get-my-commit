import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import chalk from 'chalk'
import axios from 'axios'
import os from 'os'
import fs from 'fs'
import * as util from 'util'
import * as Github from './lib/github'
import fileType from './lib/fileType'
import dateGroupType from './lib/dateGroupType'
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
        while (true) {
            let i = 0
            const printTextId = setInterval(() => {
                process.stdout.cursorTo(0)
                i = (i + 1) % 4
                const dots = new Array(i + 1).join('.')
                process.stdout.write(`Getting repositories${dots}`)
            }, 300)
    
            try {
                repositories = await Github.getRepository(token)
            } catch (err) {}
    
            if (!repositories) return null

            clearInterval(printTextId)
            process.stdout.cursorTo(0)
            process.stdout.clearLine(1)
            break
        }

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

            if (!Array.isArray(checkedRepositories) || checkedRepositories.length !== 0) break
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
                        choices: [...checkedRepositories, 'Quit'],
                        pageSize: 15
                    }
                ])).changedRepositories

                if (!Array.isArray(changedRepositories) || changedRepositories.length !== 0) break
            }

            if (!changedRepositories.includes('Quit')) {   
                for (let i = 0; i < changedRepositories.length; i++) {
                    const repo = changedRepositories[i]
    
                    let branches
                    while (true) {
                        let i = 0
                        const printTextId = setInterval(() => {
                            process.stdout.cursorTo(0)
                            i = (i + 1) % 4
                            const dots = new Array(i + 1).join('.')
                            process.stdout.write(`Getting branches${dots}`)
                        }, 300)
                
                     
                        try {
                            branches = await Github.getBranch(token, repositoryMap[repo].full_name)
                        } catch (err) {}
        
                        clearInterval(printTextId)
                        process.stdout.cursorTo(0)
                        process.stdout.clearLine(1)
                        break
                    }

                    if (branches) {
                        const { branch } = await inquirer.prompt([
                            {
                                type: 'rawlist',
                                name: 'branch',
                                message: `Choose one branch that will be the default branch (${repo})`,
                                choices: [...branches, 'Quit choosing for this repository', 'Quit choosing for all repository'],
                                pageSize: 15
                            }
                        ])

                        if (branch !== 'Quit choosing for this repository' || branch !== 'Quit choosing for all repository') repositoryBranchMap[repo] = branch
                        else if (branch === 'Quit choosing for all repository') break
                    }
                }
            }
        }

        const commitMap: { [key: string]: Commit[] } = {}
        let commits
        for (let i = 0; i < checkedRepositories.length; i++) {
            commits = null
            const repo = checkedRepositories[i]

            while (true) {
                let i = 0
                const printTextId = setInterval(() => {
                    process.stdout.cursorTo(0)
                    i = (i + 1) % 4
                    const dots = new Array(i + 1).join('.')
                    process.stdout.write(`Getting commits${dots}`)
                }, 300)
        
             
                try {
                    commits = await Github.getCommit(token, repositoryMap[repo].full_name, repositoryBranchMap[repo] || repositoryMap[repo].default_branch)
                } catch (err) {}

                clearInterval(printTextId)
                process.stdout.cursorTo(0)
                process.stdout.clearLine(1)
                break
            }

            if (Array.isArray(commits) && commits.length > 0) {
                commits = commits.filter((commit) => (commit.author && commit.author.id === userId) || (commit.committer && commit.committer.id === userId))
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

        let { selecteddateGroupType } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'selecteddateGroupType',
                message: 'Which standard would you like to group the commits?',
                choices: Object.keys(dateGroupType)
            }
        ])

        let data = ''
        let subData = ''
        let subDataWithAdditionalData = ''
        let dateGroup = ''

        const existedRepositories: string[] = Object.keys(commitMap)
        switch (fileType[selectedFileType]) {
            case '.md':
                for (let i = 0; i < existedRepositories.length; i++) {
                    const repo = existedRepositories[i]

                    data += `# ${repo}(branch: ${repositoryBranchMap[repo] || repositoryMap[repo].default_branch}, [link](${repositoryMap[repo].html_url}))${os.EOL}${os.EOL}`
                    const commits = commitMap[repo]
                    if (Array.isArray(commits) && commits.length > 0) {
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]

                            const { commit: { author: { date: authorDate }, committer: { date: committerDate } }, html_url: htmlUrl } = commit
                            
                            let { commit: { message } } = commit
                            message = message.replace(/\n/g, ' ')

                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = new Date(commitDate).toISOString()
                            commitDate = `${commitDate.substr(0, 10).replace(/-/g, '.')} ${commitDate.substr(11, 8)}`
                            
                            if (!dateGroup || dateGroup !== commitDate.substr(0, dateGroupType[selecteddateGroupType])) {
                                dateGroup = commitDate.substr(0, dateGroupType[selecteddateGroupType])
                                const dateGroupText = `### \`${commitDate.substr(0, dateGroupType[selecteddateGroupType])}\`${os.EOL}${os.EOL}`
                                subData += dateGroupText
                                subDataWithAdditionalData += dateGroupText
                            }

                            subData += `- ${message}${os.EOL}`
                            subDataWithAdditionalData += `- ${message} *(${commitDate}, [link](${htmlUrl}))*${os.EOL}${os.EOL}`
                        }
                    }
                    data += `${subData}${os.EOL}---${os.EOL}${os.EOL}${subDataWithAdditionalData}`
                    subData = ''
                    subDataWithAdditionalData = ''
                    dateGroup = ''
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

                            const { commit: { author: { date: authorDate }, committer: { date: committerDate } }, html_url: htmlUrl } = commit
                            
                            let { commit: { message } } = commit
                            message = message.replace(/\n/g, ' ')

                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = new Date(commitDate).toISOString()
                            commitDate = `${commitDate.substr(0, 10).replace(/-/g, '.')} ${commitDate.substr(11, 8)}`

                            if (!dateGroup || dateGroup !== commitDate.substr(0, dateGroupType[selecteddateGroupType])) {
                                dateGroup = commitDate.substr(0, dateGroupType[selecteddateGroupType])
                                const dateGroupText = `    <h3><code>${commitDate.substr(0, dateGroupType[selecteddateGroupType])}</code></h3>${os.EOL}`
                                subData += dateGroupText
                                subDataWithAdditionalData += dateGroupText
                            }
                            
                            subData += `      <li>${message}</li>${os.EOL}`
                            subDataWithAdditionalData += `      <li>${message} <i> (${commitDate}, <a link href=${htmlUrl}>link</a>)</li><i>${os.EOL}`
                        }
                        subData += `    </ul>${os.EOL}`
                        subDataWithAdditionalData += `    </ul>${os.EOL}`
                    }

                    temp += `${subData}<hr>${os.EOL}${subDataWithAdditionalData}`
                    subData = ''
                    subDataWithAdditionalData = ''
                    dateGroup = ''
                }
                data = data.replace('<body></body>', `<body>${os.EOL}${temp}</body>${os.EOL}`)
                break
        }

        await util.promisify(fs.writeFile)(`${__dirname}/../get_my_commit${fileType[selectedFileType]}`, data)

        console.log(chalk.bgMagenta(`get_my_commit${fileType[selectedFileType]} file was saved successfully`))
    } catch (err) {
        chalk.red.bold(console.error(err))
    }
}