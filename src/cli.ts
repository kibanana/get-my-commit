import inquirer from 'inquirer'
import terminalImage from 'terminal-image'
import axios from 'axios'
import * as Github from './lib/github'
import Repository from './ts/Repository'
import Commit from './ts/Commit'

export default async () => {
    const { token } = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Enter Personal access token(Github - Settings - Developer settings):'
            }
        ])
    
    const user = await Github.getProfile(token)

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
    console.log(`[${url}]`)
    console.log(`${login} (${name})`)
    console.log(`${bio}`)
    console.log(`${public_repos} public repos & ${total_private_repos} private_repos`)
    console.log(`Created at ${createdAt} & Updated at ${updatedAt}`)

    const { isCorrectUser } = await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'isCorrectUser',
                message: 'Is this profile yours?'
            }
        ])
    
    if (!isCorrectUser) {
        return null
    }

    const repositories = await Github.getRepository(token)
    
    const { checkedRepositories } = await inquirer
        .prompt([
            {
                type: 'checkbox',
                name: 'checkedRepositories',
                message: 'Select the repositories where you want to get the commits',
                choices: repositories.map((repo: Repository) => repo.name)
            }
        ])
    if (checkedRepositories.length === 0) return null
    
    const { isNotFixed } =  await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'isNotFixed',
                message: 'The default branch is master. Would you like to change to another branch?',
            }
        ])
    
    const repositoryMap: { [key: string]: string } = {}
    if (isNotFixed && checkedRepositories.length > 0) {
        const { changedRepositories } = await inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'changedRepositories',
                    message: 'Select the repositories where you want to change branch',
                    choices: checkedRepositories
                }
            ])
        
        changedRepositories.forEach(async (repo: string) => {
            const branches = await Github.getBranch(token, login, repo)

            const { defaultBranch } = await inquirer
                .prompt([
                    {
                        type: 'rawlist',
                        name: 'defaultBranch',
                        message: 'Choose one branch that will be the default branch',
                        choices: branches
                    }
                ])
            repositoryMap[repo] = defaultBranch
        })
    }
    
    const commitMap: { [key: string]: Commit[] } = {}
    checkedRepositories.forEach(async (repo: string) => {
        const commits = await Github.getCommit(token, login, repo)
        if (commits.length > 0) {
            commitMap[repo] = commits
        }
    })

    const { fileType } = await inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'fileType',
                message: 'Which file type would you like to extract?',
                choices: ['Markdown(.md)', 'HTML(.html)', 'Excel(.xlsx)']
            }
        ])
}