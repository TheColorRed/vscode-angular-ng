import { QuickPickItem, window } from 'vscode'

class ListItem implements QuickPickItem {

  label: string
  description = '';

  constructor(label: string) {
    this.label = label
  }
}

export async function getInput(placeHolder: string, fallback: string = '') {
  let name = await window.showInputBox({
    placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim()
  })
  name = name === undefined || name.length === 0 ? fallback : name
  return name
}

export async function getListInput(placeHolder: string, list: string[], custom: boolean = false) {
  if (!custom) {
    let name: string | undefined = ''
    name = await window.showQuickPick(list, { placeHolder: placeHolder })
    return name == undefined ? '' : name
  } else {
    return new Promise<string | undefined>(resolve => {
      let create = window.createQuickPick()
      create.placeholder = placeHolder
      create.items = list.map(i => new ListItem(i))
      create.onDidAccept(() => {
        create.dispose()
        if (create.selectedItems.length > 0) {
          resolve(create.selectedItems[0].label)
        } else {
          resolve(create.value == undefined ? '' : create.value)
        }
      })
      create.show()
    })
  }
}

export async function getYesNo(placeHolder: string): Promise<boolean> {
  let value = await window.showQuickPick(['Yes', 'No'], { placeHolder })
  return value?.toLowerCase() === 'yes' ? true : false
}

export async function getNoYes(placeHolder: string): Promise<boolean> {
  let value = await window.showQuickPick(['No', 'Yes'], { placeHolder })
  return value?.toLowerCase() === 'yes' ? true : false
}