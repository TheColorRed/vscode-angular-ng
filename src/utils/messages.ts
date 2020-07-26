import { window } from 'vscode'

export function showMessage(message: string, ...actions: string[]) {
  return window.showInformationMessage(message, ...actions)
}

export async function showError(message: string, consoleErr?: Error) {
  if (consoleErr) {
    message += ' (See output console for more details)'
    console.error(consoleErr + ' (See output console for more details)')
  }
  window.showErrorMessage(message)
  return false
}