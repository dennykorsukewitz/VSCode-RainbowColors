/**
 * Rainbow palette generation and complementary color helpers (shared by decoration modes).
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

/**
 * Starting index into the palette for folder-mode slot colors (matches previous buildFolderSlotColorPatch behavior).
 */
export function folderSlotFrameIndex(colorCounter: number, paletteLength: number): number {
    const n = paletteLength;
    if (n < 1) {
        return 0;
    }
    return ((colorCounter - 1) % n + n) % n;
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
