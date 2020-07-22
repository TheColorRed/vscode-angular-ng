import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Module extends Command {
  public async run() {

    let name = await getInput('Module Name')
    if (name.length === 0) {
      return showError('A module name is required')
    }

    let command = `generate module ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the module', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}