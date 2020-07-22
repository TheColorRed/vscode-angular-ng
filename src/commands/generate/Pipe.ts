import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Pipe extends Command {
  public async run() {

    let name = await getInput('Pipe Name')
    if (name.length === 0) {
      return showError('A pipe name is required')
    }

    let command = `generate pipe ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the pipe', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}