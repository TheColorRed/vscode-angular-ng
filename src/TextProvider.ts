import { CancellationToken, TextDocumentContentProvider, Uri } from 'vscode'

export class TextProvider implements TextDocumentContentProvider {
  public async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
    return ''
  }
}