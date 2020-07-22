import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Component extends Command {
  public async run() {

    let name = await getInput('Component Name')
    if (name.length === 0) {
      return showError('A component name is required')
    }

    let command = `generate component ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the component', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}