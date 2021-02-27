import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import * as util from 'util'
import mainProcess from './cli'

const main = async () => {
    clear()
    console.log()
    console.log(chalk.magenta.bold(await util.promisify(figlet.text)('Get my commit')))
    console.log()

    setTimeout(async () => {
        const result = await mainProcess()
        if (result) {
            console.log(chalk.bgMagenta('>>> End successfully <<<'))
        } else {
            console.log(chalk.bgMagenta('>>> End with a error <<<'))
        }
    }, 500)
}

main().catch(err => chalk.red.bold(console.error(err)))
