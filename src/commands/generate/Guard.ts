import { Command } from '../../Command'
import { getCLICreate } from '../../utils/getCLICreate'
import { showError } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Guard extends Command {
  public async run() {

    let name = await getInput('Guard Name')
    if (name.length === 0) {
      return showError('A guard name is required')
    }

    let command = `generate guard ${name}`
    await this.execCommand(command, async ({ err, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the guard', err)
      } else {
        this.openFile(dir, getCLICreate(stdout))
      }
    })
  }
}