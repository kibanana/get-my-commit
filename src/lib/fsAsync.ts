import fs from 'fs'
import * as util from 'util'

export const writeFileSync = util.promisify(fs.writeFile)