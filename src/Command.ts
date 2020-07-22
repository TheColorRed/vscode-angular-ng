import { spawn } from 'child_process'
import { join } from 'path'
import { commands, window, workspace } from 'vscode'
import { Constants } from './Constants'
import { listAngularPaths } from './utils/angularPaths'
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
export abstract class Command {

  public abstract async run(): Promise<any>

  protected async execCommand(command: string, callback: ExecCommandCallback, angular?: string) {
    let config = workspace.getConfiguration(Constants.configPrefix)

    const angularToUse = (angular ? angular : await listAngularPaths()) || ''
    const angularRoot = angularToUse
    const maxBuffer = config.get<number>('maxBuffer', 1024 * 200)

    command = this.formatCommand(`ng ${command}`)

    Output.command(command.trim())
    const spawned = spawn(command, { cwd: angularRoot, shell: true })
    let err: Error | null = null,
      stdout = '',
      stderr = ''
    spawned.stderr?.on('data', data => (stderr += data))
    spawned.stdout?.on('data', data => (Output.info(data), stdout += data))
    spawned.once('error', e => (err = e))
    spawned.once('exit', data => {
      if (err || stderr) {
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

  protected execTerminal(name: string, command: string) {
    command = this.formatCommand(`ng ${command}`)
    const terminal = window.createTerminal(name)
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
}