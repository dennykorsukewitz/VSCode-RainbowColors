/**
 * This file represents the extension logic for the "RainbowColors" extension in VS Code.
 * It provides functionality to start and stop the rainbow colors feature, which changes the background color of the status bar at a specified interval.
 * The extension also saves the original color customizations and restores them when the rainbow colors feature is stopped.
 */

// https://code.visualstudio.com/api/references/theme-color

import * as vscode from 'vscode';
import { rainbow } from "rainbow-colors-array-ts";
import {
    MODE_SETTINGS_BACKGROUND,
    MODE_SETTINGS_BORDER,
    MODE_SETTINGS_FOREGROUND,
    MODE_SETTINGS_TEXT,
} from './modeSettings';
const simpleColorConverter = require('simple-color-converter');

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

const KEYSTROKE_DEBOUNCE_MS = 32;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    const rainbowCfg = getRainbowConfig();
    const event = rainbowCfg.get<string>('event', 'interval');

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('workbench.colorCustomizations');
    vscode.workspace.getConfiguration().update('rainbowColors.colorCustomizations', colorCustomizationsOriginal, true);

    // auto start onStartupFinished
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

    /**
    * Listen for configuration change in `rainbowColors.event` or `rainbowColors.mode` section
    * When anything changes in the section, show a prompt to reload
    * VSCode window via `workbench.action.reloadWindow` command
    */
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

/**
 * Starts the rainbow colors functionality.
 */
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

/**
 * Pauses the rainbow colors animation.
 */
function pauseRainbowColors() {

    active = false;

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }
}

/**
 * Stops the rainbow colors animation and restores the original color customizations.
 */
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
}

/**
 * Removes rainbow colors from the VS Code workspace.
 */
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
}

/**
 * Retrieves the primary and complementary colors.
 *
 * @returns An object containing the primary and complementary colors.
 */
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

/**
 * Retrieves the primary color from the rainbowColors array.
 *
 * @returns The primary color.
 */
function getPrimaryColor() {

    const cfg = getRainbowConfig();
    const numberOfColors: number = cfg.get('numberOfColors', 100);

    if (!colorCounter) {
        colorCounter = Math.floor(Math.random() * numberOfColors);
    }

    if (colorCounter >= numberOfColors) {
        colorCounter = 0;
    }
    if (!rainbowColors || rainbowColors.length === 0) {
        var rainbowColorsArray = rainbow(numberOfColors, "hex", false);
        rainbowColors = rainbowColorsArray.map((color: { hex: string }) => color.hex);
    }

    let primaryColor = rainbowColors[colorCounter];
    return primaryColor;
}

/**
 * Retrieves the complementary color of the primary color.
 *
 * @param color The primary color.
 * @returns The complementary color.
 */
function getComplementaryColor(color: string) {

    const sourceColor = new simpleColorConverter({
        hex6: color,
        to: 'hsl',
        debug: false
    });

    sourceColor.color.h = (sourceColor.color.h + 180) % 360;

    let destinationColor = new simpleColorConverter({
        hsl: sourceColor.color,
        to: sourceColor.from,
        hexRef: true,
    });

    let complementaryColor = '#' + destinationColor.color;

    return complementaryColor;
}

/**
 * Applies built-in or user flag maps (true = apply rainbow color to that workbench color key).
 */
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

/**
 * Builds only the rainbow-controlled key/value pairs (no full workbench read) for duplicate detection.
 * Default mode maps come from modeSettings.ts; only modeSettings.custom is user-editable.
 */
function buildRainbowPatch(colors: { primaryColor: string; complementaryColor: string }): Record<string, string> | undefined {
    const cfg = getRainbowConfig();
    const mode = cfg.get<string>('mode', 'foreground');
    const patch: Record<string, string> = {};

    if (mode === 'folder') {
        return undefined;
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

/**
 * Applies rainbow colors to workbench (single place for config writes).
 */
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

        if (mode === 'folder') {
            return;
        }

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
    } finally {
        applyingRainbow = false;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    if (keystrokeDebounceTimer) {
        clearTimeout(keystrokeDebounceTimer);
        keystrokeDebounceTimer = undefined;
    }
}
