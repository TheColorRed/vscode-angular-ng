import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getInput } from '../../utils/selection'

export class Library extends Command {
  public async run() {

    let name = await getInput('Library Name')
    if (name.length === 0) {
      return showError('A library name is required')
    }

    let command = `generate library ${name}`
    showMessage('Creating the library, this might take a minute...')
    await this.execCommand(command, async ({ err, stderr, angular: { dir }, stdout }) => {
      if (err) {
        showError('Could not generate the library', err)
      } else {
        showMessage('The library has been created')
      }
    })
  }
}