import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Enum extends Command {
  public async run() {

    let name = await getInput('Enum Name')
    if (name.length === 0) {
      return showError('A enum name is required')
    }

    let command = `generate enum ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the enum', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}