import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import * as util from 'util'
import mainProcess from './cli'

const textSync = util.promisify(figlet.text)

const main = async () => {
    clear()
    console.log()
    console.log(chalk.magenta.bold(await textSync('Get my commit')))
    console.log()

    setTimeout(async () => {
        await mainProcess()
    }, 500)
}

main().catch(err => chalk.red.bold(console.error(err)))
