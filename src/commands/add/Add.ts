import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getListInput } from '../../utils/selection'

export class Add extends Command {

  private readonly popularPlugins: string[] = [
    '@angular/material',
    '@fortawesome/angular-fontawesome',
    '@ng-bootstrap/ng-bootstrap',
  ].sort()

  public async run() {
    const addition = await getListInput('What would you like to add?', this.popularPlugins, true)
    if (!addition) {
      return showError('A package is required to be added')
    }

    const command = `add ${addition}`
    showMessage(`Attempting to add "${addition}". This may take a minute...`)
    this.execCommand(command, ({ err }) => {
      if (err) {
        let message = 'The package could not be added.'
        if (err.message.includes('does not support schematics')) {
          message = 'The package does not support schematics and could not be installed.'
        } else if (err.message.includes('404 Not Found')) {
          message = 'The package does not exist on the registry.'
        }
        showError(message, err)
      } else {
        showMessage('The package was successfully added.')
      }
    })
  }
}