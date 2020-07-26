import { env, Terminal, Uri } from 'vscode'
import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getInput, getListInput, getNoYes } from '../../utils/selection'

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

    const files = await this.getAngularFiles()

    // Get a list of projects in the angular.json file
    const projects = this.getProjects(files[0])
    let project = ''
    if (projects.length > 1) {
      project = (await getListInput('Which project do you want to run?', projects)) || ''
    } else if (projects.length === 1) {
      project = projects[0]
    }

    // Get a list of configs for the project in the angular.json file
    const projectConfigs = this.getProjectConfig(files[0], project)
    let config = ''
    if (projectConfigs.length > 1) {
      config = (await getListInput('Which config do you want to use?', projectConfigs)) || ''
    } else if (projectConfigs.length === 1) {
      config = projectConfigs[0]
    }

    const ssl = await getNoYes('Do you need ssl?')

    // Build the command
    const command = [
      `serve`,
      project,
      `--watch`,
      `--host=${Serve.host}`,
      `--port=${Serve.port}`,
      ssl ? '--ssl' : '',
      config.length > 0 ? `--configuration=${config}` : ''
    ]

    Serve.server = this.execTerminal(Serve.terminalName, command)

    showMessage(`The server is starting on "http://${Serve.host}:${Serve.port}"`, 'Open Browser').then(button => {
      if (button === 'Open Browser') {
        env.openExternal(Uri.parse(`http://${Serve.host}:${Serve.port}`))
      }
    })
  }

  public stop() {
    if (Serve.server) {
      Serve.server.dispose()
    } else {
      showMessage(`The server has already been stopped on "http://${Serve.host}:${Serve.port}"`)
    }
  }
}