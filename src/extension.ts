import * as vscode from 'vscode';
import { disposeWorkbenchColors, initWorkbenchColors } from './decoration/workbench';

export function activate(context: vscode.ExtensionContext) {
    initWorkbenchColors(context);
}

export function deactivate() {
    disposeWorkbenchColors();
}
