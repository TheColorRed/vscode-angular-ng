import { Command } from '../../Command'
import { showError, showMessage } from '../../utils/messages'
import { getListInput } from '../../utils/selection'

export class Deploy extends Command {
  public async run() {
    const angularFiles = await this.getAngularFiles()
    const projects = this.getProjects(angularFiles[0])
    let project: string
    if (projects.length === 1) {
      project = projects[0]
    } else {
      project = await getListInput('Which project do you want to deploy?', projects) || ''
    }

    const configs = this.getProjectConfig(angularFiles[0], project)

    let config: string
    if (configs.length === 1) {
      config = configs[0]
    } else {
      config = await getListInput('Which configuration do you want to use?', configs) || ''
    }

    const command = [
      'deploy',
      project,
      `--configuration=${config}`
    ]

    showMessage('Deploying the project this may take a minute...')
    this.execCommand(command, ({ err }) => {
      if (err) {
        showError('Could not deploy the project.', err)
      } else {
        showMessage('The project has been deployed.')
      }
    })
  }

}