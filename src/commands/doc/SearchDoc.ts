import { env, Uri } from 'vscode'
import { Command } from '../../Command'
import { getInput } from '../../utils/selection'

export class SearchDoc extends Command {
  public async run() {
    const query = await getInput('What is it that you are searching for?')

    if (query.trim().length > 0) {
      env.openExternal(
        Uri.parse(`https://angular.io/api?query=${query.replace(/\s/g, '+')}`)
      )
    }
  }
}