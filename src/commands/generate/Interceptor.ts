import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Interceptor extends Command {
  public async run() {

    let name = await getInput('Interceptor Name')
    if (name.length === 0) {
      return showError('A interceptor name is required')
    }

    let command = `generate interceptor ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the interceptor', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}