import { commands, ExtensionContext, window } from 'vscode'
import { Add } from './commands/add/add'
import { Build } from './commands/build/build'
import { SearchDoc } from './commands/doc/SearchDoc'
import { Class } from './commands/generate/Class'
import { Component } from './commands/generate/Component'
import { Directive } from './commands/generate/Directive'
import { Enum } from './commands/generate/Enum'
import { Guard } from './commands/generate/Guard'
import { Interceptor } from './commands/generate/Interceptor'
import { Interface } from './commands/generate/Interface'
import { Library } from './commands/generate/Library'
import { Module } from './commands/generate/Module'
import { Pipe } from './commands/generate/Pipe'
import { Service } from './commands/generate/Service'
import { ServiceWorker } from './commands/generate/ServiceWorker'
import { WebWorker } from './commands/generate/WebWorker'
import { Serve } from './commands/serve/Serve'
import { Tests } from './commands/tests/Tests'
import { showMessage } from './utils/messages'

export function activate(context: ExtensionContext) {

	// Generate Commands
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.module', () => new Module().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.component', () => new Component().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.guard', () => new Guard().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.interceptor', () => new Interceptor().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.interface', () => new Interface().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.class', () => new Class().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.library', () => new Library().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.service', () => new Service().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.pipe', () => new Pipe().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.web-worker', () => new WebWorker().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.service-worker', () => new ServiceWorker().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.directive', () => new Directive().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.generate.enum', () => new Enum().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.add', () => new Add().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.build', () => new Build().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.server.start', () => new Serve().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.server.stop', () => new Serve().stop()))
	context.subscriptions.push(commands.registerCommand('angular-ng.test', () => new Tests().run()))
	context.subscriptions.push(commands.registerCommand('angular-ng.search-docs', () => new SearchDoc().run()))


	window.onDidCloseTerminal(t => {
		// Watch for when the server terminal closes.
		if (t.name === Serve.terminalName) {
			Serve.server = undefined
			showMessage(`The server has been stopped on "http://${Serve.host}:${Serve.port}"`)
		}
	})
}

export function deactivate() { }
