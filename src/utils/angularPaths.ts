import { Uri, workspace } from 'vscode'
import { getListInput } from './selection'

const angularFileList: Uri[] = []

export async function listAngularPaths() {
  let config = workspace.getConfiguration("angular-ng")
  // Config locations
  let additionalLocations = config.get<string | null | string[]>("location")
  if (typeof additionalLocations === 'string') {
    additionalLocations = [additionalLocations]
  } else if (!additionalLocations) {
    additionalLocations = []
  }
  let list = angularFileList.concat(additionalLocations.map(i => Uri.parse(i)))

  if (list.length == 1 && list[0].fsPath.length) return list[0].fsPath
  else if (list.length == 0) return (workspace.workspaceFolders || [])[0]?.uri.fsPath || ''
  let angularToUse = await getListInput('Which angular should be used?',
    list
      // Get the fs path from the URI
      .map(i => i.fsPath)
      // Remove Non-String values
      .filter(String)
      // Remove Duplicates
      .filter((v, i, a) => a.indexOf(v) === i)
  )
  return angularToUse
}