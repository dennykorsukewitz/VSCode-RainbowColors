/**
 * Rainbow palette generation and complementary color helpers (workbench color modes).
 */

import * as vscode from 'vscode';
import { rainbow } from 'rainbow-colors-array-ts';

const simpleColorConverter = require('simple-color-converter');

/** Align with `rainbowColors.numberOfColors` default in package.json. */
export const DEFAULT_NUMBER_OF_COLORS = 256;

export function readNumberOfColorsForPalette(section: vscode.WorkspaceConfiguration): number {
    const raw = section.get<number>('numberOfColors', DEFAULT_NUMBER_OF_COLORS);
    return normalizePaletteSize(raw);
}

export function normalizePaletteSize(value: unknown): number {
    let n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n < 1) {
        n = DEFAULT_NUMBER_OF_COLORS;
    }
    return n;
}

export function createRainbowHexPalette(count: number): string[] {
    const n = normalizePaletteSize(count);
    const rainbowColorsArray = rainbow(n, 'hex', false);
    return rainbowColorsArray.map((c: { hex: string }) => c.hex);
}

export function getComplementaryColor(hex: string): string {
    const sourceColor = new simpleColorConverter({
        hex6: hex,
        to: 'hsl',
        debug: false,
    });

    sourceColor.color.h = (sourceColor.color.h + 180) % 360;

    const destinationColor = new simpleColorConverter({
        hsl: sourceColor.color,
        to: sourceColor.from,
        hexRef: true,
    });

    return '#' + destinationColor.color;
}
