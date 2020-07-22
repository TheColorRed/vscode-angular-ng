import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Class extends Command {
  public async run() {

    let name = await getInput('Class Name')
    if (name.length === 0) {
      return showError('A class name is required')
    }

    let command = `generate class ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the class', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}