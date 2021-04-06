import chalk from 'chalk'

export default {
    error: (message: string) => console.log(chalk.red.bold(message)),
    process: (message: string) => console.log(chalk.bgMagenta(message)),
    profile: (message: string) => console.log(chalk.magenta(message))
}