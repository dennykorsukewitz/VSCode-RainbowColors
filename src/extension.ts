import * as vscode from 'vscode';
import {
    disposeWorkbenchColors,
    initWorkbenchColors,
    isFolderModeActiveForExplorer,
    setFolderDecorationController,
} from './decoration/workbench';
import { registerFolderDecoration } from './decoration/folder';

export function activate(context: vscode.ExtensionContext) {
    initWorkbenchColors(context);
    setFolderDecorationController(
        registerFolderDecoration(context, isFolderModeActiveForExplorer)
    );
}

export function deactivate() {
    disposeWorkbenchColors();
}
