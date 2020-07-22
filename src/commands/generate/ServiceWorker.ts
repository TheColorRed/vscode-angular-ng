import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'

export class ServiceWorker extends Command {
  public async run() {

    let command = `generate serviceWorker`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the service worker', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}