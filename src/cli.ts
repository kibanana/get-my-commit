import os from 'os'
import fs from 'fs'
import path from 'path'
import * as util from 'util'
import axios from 'axios'
import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import * as Github from './lib/github'
import formattingDate from './lib/formattingDate'
import errorMessage from './lib/errorMessage'
import fileType from './lib/fileType'
import dateGroupType from './lib/dateGroupType'
import * as userAnswerType from './lib/userAnswerType'
import themedLog from './lib/themedLog'
import Branch from './ts/Branch'
import Commit from './ts/Commit'
import Repository from './ts/Repository'
import User from './ts/User'

export default async (): Promise<boolean> => {
    let result = null
    const answer: { [key: string]: any } = {}
    
    try {
        result = await inquirer.prompt([
            {
                type: 'password',
                name: userAnswerType.TOKEN,
                message: 'Enter Personal access token(Github - Settings - Developer settings):'
            }
        ])

        if (!result[userAnswerType.TOKEN]) {
            themedLog.error(`>>> ${errorMessage.ERROR_EMPTY_TOKEN}`)
            return false
        }

        answer[userAnswerType.TOKEN] = result[userAnswerType.TOKEN]

        let user: null | User | number = null
        try {
            user = await Github.getProfile(answer[userAnswerType.TOKEN])
        } catch (err) {
            themedLog.error(`>>> ${errorMessage.API.ERROR_USER}`)
            return false
        }

        if (!user) {
            themedLog.error(`>>> ${errorMessage.API.EMPTY_USER}`)
            return false
        }
        else if (typeof user === 'number') {
            if (user === 401) {
                themedLog.error(`>>> ${errorMessage.API.UNAUTHORIZED}`)
            }
            return false
        }

        themedLog.process('>>> Got a profile!')

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

        const responseImage = (await axios.get(avatar_url, { responseType: 'arraybuffer' }))
        const image = Buffer.from(responseImage.data, 'binary')

        console.log(await terminalImage.buffer(image, { width: '50%', height: '50%' }))
        themedLog.profile(`[${url}]`)
        themedLog.profile(`${name} (${login})`)
        themedLog.profile(`Bio: ${bio}`)
        themedLog.profile(`Repositories: ${public_repos} public repos & ${total_private_repos} private repos`)
        themedLog.profile(`Updated at ${formattingDate(updatedAt)}`)
        themedLog.profile(`Created at ${formattingDate(createdAt)}`)

        result = await inquirer.prompt([
            {
                type: 'confirm',
                name: userAnswerType.IS_CORRECT_USER_PROFILE,
                message: 'Is this profile yours?'
            }
        ])

        if (!result[userAnswerType.IS_CORRECT_USER_PROFILE]) {
            return false
        }

        answer[userAnswerType.IS_CORRECT_USER_PROFILE] = result[userAnswerType.IS_CORRECT_USER_PROFILE]

        let repositories: null | number | Repository[] = null
        while (true) {
            let i = 0
            const printTextId = setInterval(() => {
                process.stdout.cursorTo(0)
                i = (i + 1) % 4
                const dots = new Array(i + 1).join('.')
                process.stdout.write(`Getting repositories${dots}`)
            }, 300)
    
            try {
                repositories = await Github.getRepository(answer[userAnswerType.TOKEN])
            } catch (err) {
                themedLog.error(`>>> ${errorMessage.API.ERROR_REPOSITORIES}`)
                return false
            }

            if (!Array.isArray(repositories) || (Array.isArray(repositories) && repositories.length === 0)) {
                themedLog.error(`>>> ${errorMessage.API.EMPTY_REPOSITORIES}`)
                return false
            }
            else if (typeof repositories === 'number') {
                if (repositories === 401) {
                    themedLog.error(`>>> ${errorMessage.API.UNAUTHORIZED}`)
                }
                return false
            } 

            clearInterval(printTextId)
            process.stdout.cursorTo(0)
            process.stdout.clearLine(1)
            break
        }

        themedLog.process(`>>> Got the ${repositories.length} repositories!`)

        const repositoryMap: { [key: string]: Repository } = {}
        for (let i = 0; i < repositories.length; i++) {
            const repository = repositories[i]

            if (repository.owner.id === userId) repositoryMap[repository.name] = repository
            else repositoryMap[repository.full_name] = repository
        }

        while (true) {
            result = (await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: userAnswerType.CHECKED_REPOSITORIES,
                    message: 'Select the repositories where you want to get the commits',
                    choices: Object.keys(repositoryMap),
                    pageSize: 15
                }
            ]))

            answer[userAnswerType.CHECKED_REPOSITORIES] = result[userAnswerType.CHECKED_REPOSITORIES]

            if (
                !Array.isArray(answer[userAnswerType.CHECKED_REPOSITORIES]) ||
                answer[userAnswerType.CHECKED_REPOSITORIES].length !== 0
            ) break
        }

        result = await inquirer.prompt([
            {
                type: 'confirm',
                name: userAnswerType.IS_NOT_BRANCH_FIXED,
                message: 'It will use default branch. Would you like to change to another branch?',
            }
        ])
        answer[userAnswerType.IS_NOT_BRANCH_FIXED] = result[userAnswerType.IS_NOT_BRANCH_FIXED]

        const repositoryBranchMap: { [key: string]: string } = {}
        if (
            answer[userAnswerType.IS_NOT_BRANCH_FIXED] &&
            Array.isArray(answer[userAnswerType.CHECKED_REPOSITORIES]) &&
            answer[userAnswerType.CHECKED_REPOSITORIES].length > 0
        ) {
            let branchChangeRepositories: string[] = []
            while (true) {
                result = await inquirer.prompt([
                    {
                        type: 'checkbox',
                        name: userAnswerType.BRANCH_CHANGE_REPOSITORIES,
                        message: 'Select the repositories where you want to change branch',
                        choices: [...answer[userAnswerType.CHECKED_REPOSITORIES], 'Quit'],
                        pageSize: 15
                    }
                ])
                branchChangeRepositories = result[userAnswerType.BRANCH_CHANGE_REPOSITORIES]

                if (Array.isArray(branchChangeRepositories) && branchChangeRepositories.length !== 0) break
            }

            if (!branchChangeRepositories.includes('Quit')) {   
                for (let i = 0; i < branchChangeRepositories.length; i++) {
                    const repo = branchChangeRepositories[i]
    
                    let branches: null | number | Branch[] = null
                    while (true) {
                        let i = 0
                        const printTextId = setInterval(() => {
                            process.stdout.cursorTo(0)
                            i = (i + 1) % 4
                            const dots = new Array(i + 1).join('.')
                            process.stdout.write(`Getting branches${dots}`)
                        }, 300)
                
                     
                        try {
                            branches = await Github.getBranch(answer[userAnswerType.TOKEN], repositoryMap[repo].full_name)
                        } catch (err) {
                            themedLog.error(`>>> ${errorMessage.API.ERROR_BRANCHES}`)
                            return false
                        }
        
                        clearInterval(printTextId)
                        process.stdout.cursorTo(0)
                        process.stdout.clearLine(1)
                        break
                    }

                    if (!Array.isArray(branches) || (Array.isArray(branches) && branches.length === 0)) {
                        themedLog.error(`>>> ${errorMessage.API.EMPTY_BRANCHES}`)
                        return false
                    }
                    else if (typeof branches === 'number') {
                        if (branches === 401) {
                            themedLog.error(`>>> ${errorMessage.API.UNAUTHORIZED}`)
                        } 
                        return false
                    }

                    if (branches.length > 1) {
                        result = await inquirer.prompt([
                            {
                                type: 'rawlist',
                                name: userAnswerType.BRANCH,
                                message: `Choose one branch that will be the default branch (${repo})`,
                                choices: [...branches, 'Quit choosing for this repository', 'Quit choosing for all repository'],
                                pageSize: 15
                            }
                        ])

                        answer[userAnswerType.BRANCH] = result[userAnswerType.BRANCH]

                        if (
                            answer[userAnswerType.BRANCH] !== 'Quit choosing for this repository' ||
                            answer[userAnswerType.BRANCH] !== 'Quit choosing for all repository'
                        ) repositoryBranchMap[repo] = answer[userAnswerType.BRANCH]
                        else if (answer[userAnswerType.BRANCH] === 'Quit choosing for all repository') break

                        repositoryBranchMap[repo] = answer[userAnswerType.BRANCH]
                    } else {
                        themedLog.process(`>>> There is only one branch in <${repo}> repository`)
                    }
                }
            }
        }

        const commitMap: { [key: string]: Commit[] } = {}
        let commits: null | number | Commit[] = null
        for (let i = 0; i < answer[userAnswerType.CHECKED_REPOSITORIES]!.length; i++) {
            const repo = answer[userAnswerType.CHECKED_REPOSITORIES]![i]

            while (true) {
                let i = 0
                const printTextId = setInterval(() => {
                    process.stdout.cursorTo(0)
                    i = (i + 1) % 4
                    const dots = new Array(i + 1).join('.')
                    process.stdout.write(`Getting commits${dots}`)
                }, 300)

                try {
                    commits = await Github.getCommit(
                        answer[userAnswerType.TOKEN],
                        repositoryMap[repo].full_name,
                        repositoryBranchMap[repo] || repositoryMap[repo].default_branch
                    )
                } catch (err) {}

                clearInterval(printTextId)
                process.stdout.cursorTo(0)
                process.stdout.clearLine(1)
                break
            }

            if (typeof commits === 'number') {
                if (commits === 401) {
                    themedLog.error(`>>> ${errorMessage.API.UNAUTHORIZED}`)
                } 
                return false
            } else if (Array.isArray(commits) && commits.length > 0) {
                commits = commits.filter((commit) => {
                        return (commit.author && commit.author.id === userId) ||(commit.committer && commit.committer.id === userId)
                    }
                )
                themedLog.process(`>>> Got the ${commits.length} commits from <${repo}> repository(${repositoryBranchMap[repo] || repositoryMap[repo].default_branch} branch)!`)
                commitMap[repo] = commits
            } else if (Array.isArray(commits) && commits.length === 0) {
                themedLog.process(`>>> Got nothing(0 commit) from <${repo}> repository!`)
            }

            commits = null
        }

        result = await inquirer.prompt([
            {
                type: 'rawlist',
                name: userAnswerType.SELECTED_FILE_TYPE,
                message: 'Which file type would you like to extract?',
                choices: Object.keys(fileType)
            }
        ])
        answer[userAnswerType.SELECTED_FILE_TYPE] = result[userAnswerType.SELECTED_FILE_TYPE]

        result = await inquirer.prompt([
            {
                type: 'rawlist',
                name: userAnswerType.SELECTED_DATA_GROUP_TYPE,
                message: 'Which standard would you like to group the commits?',
                choices: Object.keys(dateGroupType)
            }
        ])
        answer[userAnswerType.SELECTED_DATA_GROUP_TYPE] = dateGroupType[result[userAnswerType.SELECTED_DATA_GROUP_TYPE]]

        let data = '', subData = '', dateGroup = ''

        const existedRepositories: string[] = Object.keys(commitMap)
        switch (fileType[answer[userAnswerType.SELECTED_FILE_TYPE]]) {
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
                            message = message
                                .replace(/\n/g, ' ')
                                .replace(/(\\|\`|\*|\{|\}|\[|\]|\(|\)|\<|\>|\#|\+|\-|\.|\!)/g, `&zwj;$1`)

                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = formattingDate(commitDate)
                            commitDate = `${commitDate} ${commitDate.substr(11, 8)}`
                            
                            if (!dateGroup || dateGroup !== commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])) {
                                dateGroup = commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])
                                const dateGroupText = `### \`${commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])}\`${os.EOL}${os.EOL}`
                                subData += dateGroupText
                            }

                            subData += `- ${message} *(${commitDate}, [link](${htmlUrl}))*${os.EOL}${os.EOL}`
                        }
                    }
                    data += `${subData}${os.EOL}`
                    subData = '', dateGroup = ''
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
                        for (let j = 0; j < commits.length; j++) {
                            const commit = commits[j]

                            const { commit: { author: { date: authorDate }, committer: { date: committerDate } }, html_url: htmlUrl } = commit
                            
                            let { commit: { message } } = commit
                            message = message
                                .replace(/\n/g, ' ')
                                .replace(/\</g, `&lt;`)
                                .replace(/\>/g, `&gt;`)
                            
                            let commitDate = authorDate ? authorDate : committerDate
                            commitDate = formattingDate(commitDate)
                            commitDate = `${commitDate} ${commitDate.substr(11, 8)}`

                            if (!dateGroup || dateGroup !== commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])) {
                                dateGroup = commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])
                                const dateGroupText = `    <h3>${commitDate.substr(0, answer[userAnswerType.SELECTED_DATA_GROUP_TYPE])}</h3>${os.EOL}`
                                subData += dateGroupText
                            }
                            
                            subData += `      <li>${message} <i> (${commitDate}, <a link href=${htmlUrl}>link</a>)</li><i>${os.EOL}`
                        }
                        subData += `    </ul>${os.EOL}`
                    }

                    temp += `${subData}<hr>${os.EOL}`
                    subData = '', dateGroup = ''
                }
                data = data.replace('<body></body>', `<body>${os.EOL}${temp}</body>${os.EOL}`)
                break
        }

        try {
            let savePath = __dirname
            if (__dirname.indexOf('dist') !== -1) {
                savePath = path.join(savePath, '..', '..')
            }
            else {
                savePath = path.join(savePath, '..')
            }
            savePath = path.join(savePath, `get_my_commit${fileType[answer[userAnswerType.SELECTED_FILE_TYPE]]}`)
            await util.promisify(fs.writeFile)(savePath, data)
        } catch (err) {
            themedLog.error(`>>> ${errorMessage.ERROR_WRITE_FILE}`)
            return false
        }

        themedLog.process(`>>> get_my_commit${fileType[answer[userAnswerType.SELECTED_FILE_TYPE]]} file was saved successfully`)

        return true
    } catch (err: any) {
        themedLog.error(err)
        return false
    }
}