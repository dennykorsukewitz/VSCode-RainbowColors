/**
 * This file represents the extension logic for the "RainbowColors" extension in VS Code.
 * It provides functionality to start and stop the rainbow colors feature, which changes the background color of the status bar at a specified interval.
 * The extension also saves the original color customizations and restores them when the rainbow colors feature is stopped.
 */

// https://code.visualstudio.com/api/references/theme-color

import * as vscode from 'vscode';
import { rainbow } from "rainbow-colors-array-ts";
const simpleColorConverter = require('simple-color-converter');

let rainbowColors: string[];
let colorCounter: number = 0;
let keystrokeCounter: number = 0;
let timer: NodeJS.Timeout | undefined;

let config = vscode.workspace.getConfiguration('rainbowColors');
let background: { [key: string]: string } = config.get('modeSettings.background') as { [key: string]: string };
let foreground: { [key: string]: string } = config.get('modeSettings.foreground') as { [key: string]: string };
let custom: { [key: string]: string } = config.get('modeSettings.custom') as { [key: string]: string };
let event: string = config.get('event', 'interval');
let mode: string = config.get('mode', 'foreground');
let interval: number = config.get('interval.time', 5);
let active: boolean = true;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    let config = vscode.workspace.getConfiguration('rainbowColors');
    let background: { [key: string]: string } = config.get('modeSettings.background') as { [key: string]: string };
    let foreground: { [key: string]: string } = config.get('modeSettings.foreground') as { [key: string]: string };
    let event: string = config.get('event', 'interval');
    let mode: string = config.get('mode', 'foreground');
    let interval: number = config.get('interval', 5);

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('workbench.colorCustomizations');
    vscode.workspace.getConfiguration().update('rainbowColors.colorCustomizations', colorCustomizationsOriginal, true);

    // auto start onStartupFinished
    if (event === 'interval'){
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

    context.subscriptions.push(startDisposable, pauseDisposable, stopDisposable, removeDisposable );

    if (event === 'keystroke') {
        let typeDisposable = vscode.commands.registerCommand("type", (args) => {

            console.log('type', args.text);

            vscode.commands.executeCommand("default:type", {
                text: args.text
            });

            const numberOfKeystrokes: number = config.get('keystroke.numberOfKeystrokes', 3);
            keystrokeCounter += 1;

            // if active and the number of keystrokes is reached, set rainbow colors
            if (active && keystrokeCounter >= numberOfKeystrokes) {
                setRainbowColors();
                keystrokeCounter = 0;
            }
        });

        context.subscriptions.push(typeDisposable);
    }

    /**
    * Listen for configuration change in `rainbowColors.event` or `rainbowColors.mode` section
    * When anything changes in the section, show a prompt to reload
    * VSCode window via `workbench.action.reloadWindow` command
    */
    vscode.workspace.onDidChangeConfiguration(configChangeEvent => {

        if (configChangeEvent.affectsConfiguration('rainbowColors.event') || configChangeEvent.affectsConfiguration('rainbowColors.mode')) {
        const actions = ['Reload now', 'Later'];

        vscode.window.showInformationMessage('The VSCode window needs to reload for the changes to take effect. Would you like to reload the window now?', ...actions)
            .then(action => {

                if (action === actions[0]) {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
    });
}

/**
 * Removes rainbow colors from the VS Code workspace.
 */
function removeRainbowColors() {

    active = false;

    let colorCustomizationsOriginal = {};
    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizationsOriginal, true);
}

/**
 * Starts the rainbow colors functionality.
 */
function startRainbowColors() {

    active = true;

    if (event === 'interval') {

        setRainbowColors();

        if ( timer) {
            clearInterval(timer);
            timer = undefined;
        }

        timer = setInterval(() => {
            setRainbowColors();
        }, interval * 1000);
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
}

/**
 * Stops the rainbow colors animation and restores the original color customizations.
 */
function stopRainbowColors() {

    active = false;

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('rainbowColors.colorCustomizations');
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

    const numberOfColors: number = config.get('numberOfColors', 100);

    if (!colorCounter) {
        colorCounter = Math.floor(Math.random() * numberOfColors);
    }

    if (colorCounter >= numberOfColors) {
        colorCounter = 0;
    }

    if (!rainbowColors) {
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
        debug: true
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
 * Sets the rainbow colors in the VS Code workspace.
 */
function setRainbowColors() {

    let colors = getColors();
    let colorCustomizations: { [key: string]: string } = vscode.workspace.getConfiguration().get('workbench.colorCustomizations') || {};

    if (mode === 'background') {
        Object.keys(background).forEach(key => {
            if (background[key]) {
                colorCustomizations[key] = colors['primaryColor'];
            }
        });
        Object.keys(foreground).forEach(key => {
            if (foreground[key]) {
                colorCustomizations[key] = colors['complementaryColor'];
            }
        });
    }

    if (mode === 'foreground') {
        Object.keys(foreground).forEach(key => {
            if (foreground[key]) {
                colorCustomizations[key] = colors['primaryColor'];
            }
        });
    }

    if (mode === 'custom') {
        let custom: { [key: string]: string } = config.get('modeSettings.custom') as { [key: string]: string };

        console.log('DENNY');
        console.log('custom');
        console.log(custom);

        // return if custom is not set
        if (!custom) {
            return;
        }
        Object.keys(custom).forEach(key => {
            if (custom[key]) {
                colorCustomizations[key] = colors['primaryColor'];
            }
        });
    }

    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizations, true);
}

// This method is called when your extension is deactivated
export function deactivate() { }

