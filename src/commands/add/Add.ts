import { Terminal } from 'vscode'
import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getListInput } from '../../utils/selection'

export class Add extends Command {

  public static readonly terminalName = 'Angular Ng Add Package'
  public static terminal?: Terminal

  private readonly popularPlugins: string[] = [
    '@angular/material',
    '@fortawesome/angular-fontawesome',
    '@ng-bootstrap/ng-bootstrap',
    '@angular/fire',
    '@azure/ng-deploy',
    '@zeit/ng-deploy'
  ].sort()

  public async run() {
    const addition = await getListInput('What would you like to add?', this.popularPlugins, true)
    if (!addition) {
      return showError('A package is required to be added')
    }

    const command = `add ${addition}`
    showMessage(`Attempting to add "${addition}".`)
    if (!Add.terminal) {
      Add.terminal = this.execTerminal(Add.terminalName, command)
    } else {
      this.execTerminal(Add.terminal, command)
    }
  }
}