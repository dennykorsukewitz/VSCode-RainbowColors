/**
 * Explorer file/folder colors in folder mode via FileDecorationProvider + contributed ThemeColor ids.
 */

import * as vscode from 'vscode';
import { readNumberOfColorsForPalette } from '../utils/rainbowPalette';

/** Upper bound: each id must exist under `contributes.colors` in package.json. */
export const MAX_FOLDER_COLOR_SLOT_COUNT = 256;

export const FOLDER_SLOT_COLOR_IDS: string[] = Array.from(
    { length: MAX_FOLDER_COLOR_SLOT_COUNT },
    (_, i) => `rainbowColors.folderSlot${i}`
);

/**
 * Slot count for folder mode: same source as palette size (`rainbowColors.numberOfColors`), capped by contributed ThemeColor ids.
 */
export function getEffectiveFolderSlotCount(rainbowSection: vscode.WorkspaceConfiguration): number {
    const n = readNumberOfColorsForPalette(rainbowSection);
    return Math.min(n, MAX_FOLDER_COLOR_SLOT_COUNT);
}

/**
 * Stable slot index from a path string (workspace-relative when possible).
 */
export function hashPathForSlot(relativePath: string, slotCount: number): number {
    let h = 0;
    const s = relativePath.toLowerCase();
    for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    const u = h >>> 0;
    const mod = slotCount >= 1 ? slotCount : 1;
    return u % mod;
}

export type FolderDecorationController = {
    readonly provider: vscode.FileDecorationProvider;
    notifyAllChanged(): void;
};

/**
 * Decorations apply only when isFolderModeActive() is true (extension active + mode folder).
 */
export function createFolderDecorationController(
    isFolderModeActive: () => boolean
): FolderDecorationController {
    const emitter = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();

    const provider: vscode.FileDecorationProvider = {
        onDidChangeFileDecorations: emitter.event,
        provideFileDecoration(uri: vscode.Uri): vscode.FileDecoration | undefined {
            if (!isFolderModeActive()) {
                return undefined;
            }
            if (uri.scheme !== 'file' && uri.scheme !== 'vscode-remote') {
                return undefined;
            }

            // Use workspace API so paths match the Explorer (case-sensitivity, normalization).
            const includeRootName = (vscode.workspace.workspaceFolders?.length ?? 0) > 1;
            let relativePath = vscode.workspace.asRelativePath(uri, includeRootName);
            if (!relativePath.length) {
                relativePath = '.';
            }

            const cfg = vscode.workspace.getConfiguration('rainbowColors');
            const slotCount = getEffectiveFolderSlotCount(cfg);
            const slot = hashPathForSlot(relativePath, slotCount);
            const colorId = FOLDER_SLOT_COLOR_IDS[slot];
            return new vscode.FileDecoration(undefined, 'RainbowColors', new vscode.ThemeColor(colorId));
        },
    };

    return {
        provider,
        notifyAllChanged() {
            emitter.fire(undefined);
        },
    };
}

export function registerFolderDecoration(
    context: vscode.ExtensionContext,
    isFolderModeActive: () => boolean
): FolderDecorationController {
    const controller = createFolderDecorationController(isFolderModeActive);
    context.subscriptions.push(
        vscode.window.registerFileDecorationProvider(controller.provider)
    );
    return controller;
}
