import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import chalk from 'chalk'
import axios from 'axios'
import os from 'os'
import * as Github from './lib/github'
import Repository from './ts/Repository'
import Commit from './ts/Commit'
import * as fsAsync from './lib/fsAsync'
import fileType from './lib/fileType'

export default async () => {
    const { token } = await inquirer
        .prompt([
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
    createdAt = new Date(createdAt).toISOString().substr(0, 10)
    updatedAt = new Date(updatedAt).toISOString().substr(0, 10)

    const responseImage = (await axios.get(avatar_url, { responseType: 'arraybuffer' }))
    const image = Buffer.from(responseImage.data, 'binary')

    console.log(await terminalImage.buffer(image, { width: '50%', height: '50%' }))
    console.log(chalk.magenta(`[${url}]`))
    console.log(chalk.magenta(`${login} (${name})`))
    console.log(chalk.magenta(`${bio}`))
    console.log(chalk.magenta(`${public_repos} public repos & ${total_private_repos} private_repos`))
    console.log(chalk.magenta(`Created at ${createdAt} & Updated at ${updatedAt}`))

    const { isCorrectUser } = await inquirer
        .prompt([
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

    const { checkedRepositories } = await inquirer
        .prompt([
            {
                type: 'checkbox',
                name: 'checkedRepositories',
                message: 'Select the repositories where you want to get the commits',
                choices: repositories.map((repo: Repository) => repo.name),
                pageSize: 15
            }
        ])
    if (Array.isArray(checkedRepositories) && checkedRepositories.length === 0) return null
    
    const { isNotFixed } =  await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'isNotFixed',
                message: 'The default branch is master. Would you like to change to another branch?',
            }
        ])
    
    const repositoryMap: { [key: string]: string } = {}
    if (isNotFixed && Array.isArray(checkedRepositories) && checkedRepositories.length > 0) {
        const { changedRepositories } = await inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'changedRepositories',
                    message: 'Select the repositories where you want to change branch',
                    choices: checkedRepositories,
                    pageSize: 15
                }
            ])
        
        changedRepositories.forEach(async (repo: string) => {
            let branches
            try {
                branches = await Github.getBranch(token, login, repo)
            } catch (err) {}

            if (branches) {
                const { defaultBranch } = await inquirer
                    .prompt([
                        {
                            type: 'rawlist',
                            name: 'defaultBranch',
                            message: 'Choose one branch that will be the default branch',
                            choices: branches,
                            pageSize: 15
                        }
                    ])

                repositoryMap[repo] = defaultBranch
            }
        })
    }
    
    const commitMap: { [key: string]: Commit[] } = {}
    checkedRepositories.forEach(async (repo: string) => {
        let commits
        try {
            commits = await Github.getCommit(token, login, repo)
        } catch (err) {}

        if (Array.isArray(commits) && commits.length > 0) {
            commitMap[repo] = commits
        }
    })

    const { selectedFileType } = await inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'selectedFileType',
                message: 'Which file type would you like to extract?',
                choices: Object.keys(fileType)
            }
        ])
    
    let data = '<!doctype html><html><head><title>Get my commit</title></head><body></body></html>'

    switch (fileType[selectedFileType]) {
        case '.md':
            checkedRepositories.forEach((repo: string) => {
                data += `# ${repo} (branch: ${repositoryMap[repo] || 'master'})${os.EOL}`
                const commits = commitMap[repo]
                if (Array.isArray(commits) && commits.length > 0) {
                    commits.forEach((commit: Commit) => {
                        data += `- ${commit.commit.message}${os.EOL}`
                    })
                }
            })
            break
        case '.html':
            let subData = ''
            checkedRepositories.forEach((repo: string) => {
                subData += `<h1>${repo} (branch: ${repositoryMap[repo] || 'master'})</h1>`
                const commits = commitMap[repo]
                if (Array.isArray(commits) && commits.length > 0) {
                    subData += `<ul>`
                    commits.forEach((commit: Commit) => {
                        subData += `<li>${commit.commit.message}</li>`
                    })
                    subData += `</ul>`
                }
            })
            data = data.replace('<body></body>', `<body>${subData}</body>`)
            break
    }

    await fsAsync.writeFileSync(`${__dirname}/../get_my_commit${fileType[selectedFileType]}`, data)

    console.log(chalk.magenta(`get_my_commit${fileType[selectedFileType]} file was saved successfully`))
}