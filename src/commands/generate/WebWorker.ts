import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class WebWorker extends Command {
  public async run() {

    let name = await getInput('Web Worker Name')
    if (name.length === 0) {
      return showError('A web worker name is required')
    }

    let command = `generate webWorker ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the web worker', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}