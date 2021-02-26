import inquirer from 'inquirer'
import * as Github from './lib/github'

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
}