import { Command } from '../../Command'
import { getYesNo } from '../../utils/selection'

export class Tests extends Command {
  public async run() {
    const watchForChanges = await getYesNo('Should we watch for changes?')

    const command = [
      'test',
      watchForChanges ? '--watch' : ''
    ]

    this.execTerminal('Angular Ng Test', command.join(' '))
  }
}