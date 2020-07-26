import { workspace } from 'vscode'
import { Command } from '../../Command'

export class RouteList extends Command {
  public async run() {
    let files = await workspace.findFiles('**/app-routing.module.{ts,js}')
    let fileData = (await workspace.fs.readFile(files[0])).toString()
  }
}
