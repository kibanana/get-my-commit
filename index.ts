import clear from 'clear'
import chalk from 'chalk'
import figlet from 'figlet'
import * as util from 'util'

const textSync = util.promisify(figlet.text)

const main = async () => {
    clear()
    console.log()
    console.log(chalk.red(await textSync('Get my commit')))
    console.log()
}

main().catch(err => console.log(err))
