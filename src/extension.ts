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
let counter: number = 0;
let timer: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('workbench.colorCustomizations');

    vscode.workspace.getConfiguration().update('rainbowColors.colorCustomizations', colorCustomizationsOriginal, true);

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

    context.subscriptions.push(startDisposable, stopDisposable);
}

/**
 * Starts the rainbow colors feature.
 */
function startRainbowColors() {

    const config = vscode.workspace.getConfiguration('rainbowColors');
    const background: { [key: string]: string } = config.get('background') as { [key: string]: string };
    const foreground: { [key: string]: string } = config.get('foreground') as { [key: string]: string };
    const mode: string = config.get('mode', 'Foreground');
    const interval: number = config.get('interval', 5);

    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }

    if (interval) {
        timer = setInterval(() => {

            let colors = getColors();

            counter++;

            let colorCustomizations: { [key: string]: string } = vscode.workspace.getConfiguration().get('workbench.colorCustomizations') || {};

            if (mode === 'Background') {
                for (let key in background) {
                    if (background[key]) {
                        colorCustomizations[key] = colors['primaryColor'];
                    }
                }
                for (let key in foreground) {
                    if (foreground[key]) {
                        colorCustomizations[key] = colors['complementaryColor'];
                    }
                }
            }

            if (mode === 'Foreground') {
                for (let key in foreground) {
                    if (foreground[key]) {
                        colorCustomizations[key] = colors['primaryColor'];
                    }
                }
            }
            vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizations, true);

        }, interval * 1000);
    }
}

function pauseRainbowColors() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
}

function stopRainbowColors() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }

    let colorCustomizationsOriginal = vscode.workspace.getConfiguration().get('rainbowColors.colorCustomizations');

    vscode.workspace.getConfiguration().update('workbench.colorCustomizations', colorCustomizationsOriginal, true);
}

function getColors() {

    const config = vscode.workspace.getConfiguration('rainbowColors');
    const numberOfColors: number = config.get('numberOfColors', 100);

    if (!counter) {
        counter = Math.floor(Math.random() * numberOfColors);
    }

    if (counter >= numberOfColors) {
        counter = 0;
    }

    if (!rainbowColors) {
        var rainbowColorsArray = rainbow(numberOfColors, "hex", false);
        rainbowColors = rainbowColorsArray.map((color: { hex: string }) => color.hex);
    }
    let primaryColor = '#' + rainbowColors[counter];
    let complementaryColor = getComplementaryColor(primaryColor);
    let colors = {
        primaryColor: primaryColor,
        complementaryColor: complementaryColor
    };

    return colors;
}

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

// This method is called when your extension is deactivated
export function deactivate() { }
