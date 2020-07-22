import { Terminal } from 'vscode'
import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getInput, getNoYes } from '../../utils/selection'

export class Serve extends Command {

  public static readonly terminalName: string = 'Angular Ng Server'
  public static server?: Terminal
  public static host: string
  public static port: number

  public async run() {
    if (Serve.server) {
      showError('There is already an existing server running.')
      return
    }
    Serve.host = await getInput('What host do you want to run the server with? (Default: localhost)', 'localhost')
    Serve.port = parseInt(await getInput('What port do you want to run the server on? (Default: 4200)', '4200'))

    const openBrowser = await getNoYes('Do you want to open a browser window?')

    const command = [
      `serve`,
      `--host=${Serve.host}`,
      `--port=${Serve.port}`,
      `--watch`,
      openBrowser ? '--open' : ''
    ]

    Serve.server = this.execTerminal(Serve.terminalName, command.join(' '))

    showMessage(`The server is starting on "http://${Serve.host}:${Serve.port}"`)
  }

  public stop() {
    if (Serve.server) {
      Serve.server.dispose()
    } else {
      showMessage(`The server has already been stopped on "http://${Serve.host}:${Serve.port}"`)
    }
  }
}