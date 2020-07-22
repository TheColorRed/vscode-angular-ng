import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getInput, getYesNo } from '../../utils/selection'

export class Build extends Command {
  public async run() {
    const isProd = await getYesNo('Is this a production build?')
    const prod = isProd ? '--prod' : ''

    let config = ''
    if (!isProd) {
      const isOther = await getYesNo('Do you want to use another configuration?')
      if (isOther) {
        config = await getInput('What configuration do you want to use?')
      }
    }

    showMessage('Building your project, this may take a minute...')
    const command = `build ${prod} ${!!config ? `--configuration=${config}` : ''}`
    this.execCommand(command, ({ err }) => {
      if (err) {
        showError('Was not able to build project.')
      } else {
        showMessage('Project was built.')
      }
    })
  }
}