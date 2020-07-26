import { spawn } from 'child_process'
import { join } from 'path'
import { commands, StatusBarAlignment, StatusBarItem, Terminal, Uri, window, workspace } from 'vscode'
import { Constants } from './Constants'
import { listAngularPaths } from './utils/angularPaths'
import { showError } from './utils/messages'
import Output from './utils/Output'

declare type ExecCommandCallback = (info: {
  err: Error | null
  stdout: string
  stderr: string
  angular: {
    dir: string
    path: string
  }
}) => void

type CommandMain = 'generate' | 'add' | 'analytics' | 'build' | 'config' | 'deploy' | 'doc' | 'e2e' | 'generate' | 'help' | 'line' | 'new' | 'run' | 'serve' | 'test' | 'update' | 'version' | 'xi18n'

type SchematicType = 'appShell' | 'application' | 'class' | 'component' | 'directive' | 'enum' | 'guard' | 'interceptor' | 'interface' | 'library' | 'module' | 'pipe' | 'service' | 'serviceWorker' | 'webWorker'

export interface IAngular {
  $schema?: string
  version?: number
  newProjectRoot?: string
  projects?: {
    [key: string]: {
      projectType?: 'application' | 'library'
      schematics?: object
      root?: string
      sourceRoot?: string
      prefix?: string
      architect?: {
        build?: {
          builder?: string
          options?: object
          configurations?: object
        }
      }
    }
  }
  defaultProject?: string
}

export abstract class Command {

  private angularFiles: IAngular[] = []

  public abstract async run(): Promise<any>
  private static statusBarItemProcessing: StatusBarItem

  protected async execCommand(command: string | string[], callback: ExecCommandCallback, angular?: string) {

    if (!Command.statusBarItemProcessing) {
      Command.statusBarItemProcessing = window.createStatusBarItem(StatusBarAlignment.Left)
      Command.statusBarItemProcessing.text = '$(sync~spin) Processing...'
    }

    Command.statusBarItemProcessing.show()

    let config = workspace.getConfiguration(Constants.configPrefix)

    const angularToUse = (angular ? angular : await listAngularPaths()) || ''
    const angularRoot = angularToUse
    const maxBuffer = config.get<number>('maxBuffer', 1024 * 200)

    if (Array.isArray(command)) {
      command = command.filter(String).join(' ')
    }

    command = this.formatCommand(`ng ${command}`)


    Output.command(command.trim())
    const spawned = spawn(command, { cwd: angularRoot, shell: true })
    let err: Error | null = null,
      stdout = '',
      stderr = ''
    spawned.stderr?.on('error', error => (err = error))
    spawned.stderr?.on('data', data => (stderr += data))
    spawned.stdout?.on('data', data => (stdout += data))
    spawned.once('error', error => (err = error))
    spawned.once('exit', data => {
      Command.statusBarItemProcessing.hide()
      if (err || stderr.length > 0) {
        if (!err) err = new Error(stderr)
        Output.error(err.message)
        Output.showConsole()
      }

      callback({
        err, stdout, stderr, angular: {
          dir: angularRoot, path: angularToUse
        }
      })
    })
  }

  protected execTerminal(name: string, command: string | string[]): Terminal
  protected execTerminal(terminal: Terminal, command: string | string[]): Terminal
  protected execTerminal(nameOrTerminal: string | Terminal, command: string | string[]) {
    if (Array.isArray(command)) {
      command = command.filter(String).join(' ')
    }
    command = this.formatCommand(`ng ${command}`)
    const terminal = typeof nameOrTerminal === 'string' ?
      window.createTerminal(nameOrTerminal) :
      nameOrTerminal

    terminal.show()
    terminal.sendText(command)
    return terminal
  }

  protected async openFile(root: string, files?: string | string[]) {
    if (!files) return
    try {
      files = typeof files === 'string' ? [files] : files
      for (let file of files) {
        let doc = await workspace.openTextDocument(join(root, file))
        window.showTextDocument(doc)
      }
      this.refreshFilesExplorer()
    } catch (e) {
      console.log(e.message)
    }
  }

  protected refreshFilesExplorer() {
    commands.executeCommand('workbench.files.action.refreshFilesExplorer')
  }

  private formatCommand(command: string) {
    let config = workspace.getConfiguration(Constants.configPrefix)
    let parts = command.split(' ').map(String)
    parts.shift()
    let main = parts.shift() as CommandMain
    switch (main) {
      case 'generate':
        let schematic = parts.shift() as SchematicType
        let schematicName = parts.shift() as string
        let schematicRoot = ''
        if (!schematicName.startsWith('/')) {
          schematicRoot = config.get(`generate.location.${schematic}`, '')
        }
        command = `ng ${main} ${schematic} ${join(schematicRoot, schematicName)} ${parts.join(' ')}`
        break
    }
    return command
  }

  protected async getAngularJson(path: Uri) {
    const file = await workspace.fs.readFile(path)
    return JSON.parse(file.toString())
  }

  protected getProjects(angular: IAngular) {
    return Object.keys(angular.projects || [])
  }

  protected getProjectConfig(angular: IAngular, projectName: string) {
    return Object.keys(angular.projects?.[projectName]?.architect?.build?.configurations || [])
  }

  protected async getAngularFiles() {
    const files = await workspace.findFiles('**/angular.json', 'node_modules')
    for (const file of files) {
      let content = await this.getAngularJson(file)
      this.angularFiles.push(content)
    }
    if (this.angularFiles.length === 0) {
      showError('There were no projects found')
      return []
    }
    return this.angularFiles
  }
}