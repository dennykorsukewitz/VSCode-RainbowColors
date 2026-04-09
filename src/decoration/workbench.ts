/**
 * Workbench rainbow colors: commands, timers, intervals, palette application.
 *
 * @see https://code.visualstudio.com/api/references/theme-color
 */

import * as vscode from 'vscode';
import {
    FOLDER_SLOT_COLOR_IDS,
    getEffectiveFolderSlotCount,
    type FolderDecorationController,
} from './folder';
import {
    MODE_SETTINGS_BACKGROUND,
    MODE_SETTINGS_BORDER,
    MODE_SETTINGS_FOREGROUND,
    MODE_SETTINGS_TEXT,
} from '../modeSettings';
import {
    createRainbowHexPalette,
    folderSlotFrameIndex,
    getComplementaryColor,
    readNumberOfColorsForPalette,
} from '../utils/rainbowPalette';

/** Always read fresh; avoids stale copies from module load vs activate shadowing. */
function getRainbowConfig(): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration('rainbowColors');
}

let rainbowColors: string[];
let colorCounter: number = 0;
let keystrokeCounter: number = 0;
let timer: NodeJS.Timeout | undefined;
let keystrokeDebounceTimer: NodeJS.Timeout | undefined;
let applyingRainbow: boolean = false;

/** Last rainbow-only key/value pairs written to workbench; skip duplicate updates. */
let lastRainbowPatch: Record<string, string> | undefined;

let active: boolean = true;

let folderDecorationController: FolderDecorationController | undefined;

const KEYSTROKE_DEBOUNCE_MS = 32;

export function isFolderModeActiveForExplorer(): boolean {
    return active && getRainbowConfig().get<string>('mode', 'foreground') === 'folder';
}

export function setFolderDecorationController(controller: FolderDecorationController | undefined): void {
    folderDecorationController = controller;
}

export function initWorkbenchColors(context: vscode.ExtensionContext): void {

    const rainbowCfg = getRainbowConfig();
    const event = rainbowCfg.get<string>('event', 'interval');

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('workbench.colorCustomizations');
    vscode.workspace.getConfiguration().update('rainbowColors.colorCustomizations', colorCustomizationsOriginal, true);

    if (event === 'interval') {
        startRainbowColors();
    }

    let startDisposable = vscode.commands.registerCommand('RainbowColors.start', () => {
        vscode.window.showInformationMessage('Start RainbowColors!');
        startRainbowColors();
    });

    let pauseDisposable = vscode.commands.registerCommand('RainbowColors.pause', () => {
        vscode.window.showInformationMessage('Pause RainbowColors!');
        pauseRainbowColors();
    });

    let stopDisposable = vscode.commands.registerCommand('RainbowColors.stop', () => {
        vscode.window.showInformationMessage('Stop RainbowColors!');
        stopRainbowColors();
    });

    let removeDisposable = vscode.commands.registerCommand('RainbowColors.remove', () => {
        vscode.window.showInformationMessage('Remove RainbowColors!');
        removeRainbowColors();
    });

    context.subscriptions.push(startDisposable, pauseDisposable, stopDisposable, removeDisposable);

    if (event === 'keystroke') {
        let typeDisposable = vscode.commands.registerCommand("type", (args) => {

            vscode.commands.executeCommand("default:type", {
                text: args.text
            });

            const numberOfKeystrokes: number = getRainbowConfig().get('keystroke.numberOfKeystrokes', 3);
            keystrokeCounter += 1;

            if (active && keystrokeCounter >= numberOfKeystrokes) {
                keystrokeCounter = 0;
                scheduleDebouncedRainbowApply();
            }
        });

        context.subscriptions.push(typeDisposable);
    }

    const configListener = vscode.workspace.onDidChangeConfiguration(configChangeEvent => {

        if (configChangeEvent.affectsConfiguration('rainbowColors.event') || configChangeEvent.affectsConfiguration('rainbowColors.mode')) {
            const actions = ['Reload now', 'Later'];

            vscode.window.showInformationMessage('The VSCode window needs to reload for the changes to take effect. Would you like to reload the window now?', ...actions)
                .then(action => {

                    if (action === actions[0]) {
                        vscode.commands.executeCommand('RainbowColors.remove');
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                        vscode.commands.executeCommand('RainbowColors.start');
                    }
                });
        }

        if (configChangeEvent.affectsConfiguration('rainbowColors.interval.time') && active) {
            const ev = getRainbowConfig().get<string>('event', 'interval');
            if (ev === 'interval') {
                restartIntervalTimer();
            }
        }
    });
    context.subscriptions.push(configListener);
}

function scheduleDebouncedRainbowApply() {
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
    }
    keystrokeDebounceTimer = setTimeout(() => {
        keystrokeDebounceTimer = undefined;
        applyRainbowColorsToWorkbench();
    }, KEYSTROKE_DEBOUNCE_MS);
}

function restartIntervalTimer() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    const cfg = getRainbowConfig();
    if (cfg.get<string>('event', 'interval') !== 'interval' || !active) {
        return;
    }
    const intervalSec = cfg.get<number>('interval.time', 5);
    timer = setInterval(() => {
        applyRainbowColorsToWorkbench();
    }, intervalSec * 1000);
}

function startRainbowColors() {

    active = true;

    const cfg = getRainbowConfig();
    const event = cfg.get<string>('event', 'interval');

    if (event === 'interval') {

        applyRainbowColorsToWorkbench();

        if (timer) {
            clearInterval(timer);
            timer = undefined;
        }

        const intervalSec = cfg.get<number>('interval.time', 5);
        timer = setInterval(() => {
            applyRainbowColorsToWorkbench();
        }, intervalSec * 1000);
    }

    if (event === 'one-time') {
        colorCounter = 0;
        rainbowColors = [];
        applyRainbowColorsToWorkbench();
    }
}

function pauseRainbowColors() {

    active = false;
    lastRainbowPatch = undefined;

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }
    folderDecorationController?.notifyAllChanged();
}

function stopRainbowColors() {

    active = false;
    lastRainbowPatch = undefined;

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('rainbowColors.colorCustomizations');
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizationsOriginal, true);
    folderDecorationController?.notifyAllChanged();
}

function removeRainbowColors() {

    active = false;
    lastRainbowPatch = undefined;

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }

    let colorCustomizationsOriginal = {};
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizationsOriginal, true);
    folderDecorationController?.notifyAllChanged();
}

function getColors() {

    let primaryColor = getPrimaryColor();
    let complementaryColor = getComplementaryColor(primaryColor);

    let colors = {
        primaryColor: primaryColor,
        complementaryColor: complementaryColor
    };

    colorCounter++;

    return colors;
}

function getPrimaryColor() {

    const cfg = getRainbowConfig();
    const numberOfColors: number = readNumberOfColorsForPalette(cfg);

    if (!colorCounter) {
        colorCounter = Math.floor(Math.random() * numberOfColors);
    }

    if (colorCounter >= numberOfColors) {
        colorCounter = 0;
    }
    if (!rainbowColors || rainbowColors.length === 0) {
        rainbowColors = createRainbowHexPalette(numberOfColors);
    }

    let primaryColor = rainbowColors[colorCounter];
    return primaryColor;
}

function addFlaggedColorEntries(
    flags: Record<string, boolean> | undefined,
    patch: Record<string, string>,
    color: string
): void {
    if (!flags) {
        return;
    }
    Object.keys(flags).forEach((key) => {
        if (flags[key]) {
            patch[key] = color;
        }
    });
}

function buildRainbowPatch(colors: { primaryColor: string; complementaryColor: string }): Record<string, string> | undefined {
    const cfg = getRainbowConfig();
    const mode = cfg.get<string>('mode', 'foreground');
    const patch: Record<string, string> = {};

    if (mode === 'folder') {
        return buildFolderSlotColorPatch();
    }
    if (mode === 'background') {
        addFlaggedColorEntries(MODE_SETTINGS_BACKGROUND, patch, colors.primaryColor);
        addFlaggedColorEntries(MODE_SETTINGS_FOREGROUND, patch, colors.complementaryColor);
        return patch;
    }
    if (mode === 'text') {
        addFlaggedColorEntries(MODE_SETTINGS_TEXT, patch, colors.primaryColor);
        return patch;
    }
    if (mode === 'border') {
        addFlaggedColorEntries(MODE_SETTINGS_BORDER, patch, colors.primaryColor);
        return patch;
    }
    if (mode === 'foreground') {
        addFlaggedColorEntries(MODE_SETTINGS_FOREGROUND, patch, colors.primaryColor);
        return patch;
    }
    if (mode === 'custom') {
        const custom = cfg.get<Record<string, boolean>>('modeSettings.custom') || {};
        addFlaggedColorEntries(custom, patch, colors.primaryColor);
        return patch;
    }

    return undefined;
}

function buildFolderSlotColorPatch(): Record<string, string> {
    const cfg = getRainbowConfig();
    const numberOfColors: number = readNumberOfColorsForPalette(cfg);

    if (!rainbowColors || rainbowColors.length === 0) {
        rainbowColors = createRainbowHexPalette(numberOfColors);
    }

    const patch: Record<string, string> = {};
    const n = rainbowColors.length;
    const frame = folderSlotFrameIndex(colorCounter, n);
    const slotCount = getEffectiveFolderSlotCount(cfg);

    for (let i = 0; i < slotCount; i++) {
        const hex = rainbowColors[(frame + i) % n];
        patch[FOLDER_SLOT_COLOR_IDS[i]] = hex;
    }

    return patch;
}

function rainbowPatchEquals(a: Record<string, string> | undefined, b: Record<string, string> | undefined): boolean {
    if (!a || !b) {
        return false;
    }
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (let i = 0; i < keysA.length; i++) {
        if (keysA[i] !== keysB[i] || a[keysA[i]] !== b[keysB[i]]) {
            return false;
        }
    }
    return true;
}

function applyRainbowColorsToWorkbench() {

    if (!active) {
        return;
    }
    if (applyingRainbow) {
        return;
    }

    applyingRainbow = true;
    try {

        const cfg = getRainbowConfig();
        const mode = cfg.get<string>('mode', 'foreground');

        const colors = getColors();

        const patch = buildRainbowPatch(colors);

        if (!patch || Object.keys(patch).length === 0) {
            return;
        }

        if (rainbowPatchEquals(patch, lastRainbowPatch)) {
            return;
        }

        let colorCustomizations: { [key: string]: string } = vscode.workspace.getConfiguration().get('workbench.colorCustomizations') || {};
        Object.assign(colorCustomizations, patch);

        lastRainbowPatch = { ...patch };
        vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizations, true);

        if (mode === 'folder') {
            folderDecorationController?.notifyAllChanged();
        }
    } finally {
        applyingRainbow = false;
    }
}

export function disposeWorkbenchColors(): void {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }
}
