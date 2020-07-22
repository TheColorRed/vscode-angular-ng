import { window } from 'vscode'

export async function showMessage(message: string) {
  window.showInformationMessage(message)
  return true
}

export async function showError(message: string, consoleErr?: Error) {
  if (consoleErr) {
    message += ' (See output console for more details)'
    console.error(consoleErr + ' (See output console for more details)')
  }
  window.showErrorMessage(message)
  return false
}