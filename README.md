<img align="right" width="150" height="150" src="doc/images/icon.png">

# RainbowColors

**RainbowColors** is an extension that changes the foreground or background color rainbowly after a certain interval.

## Why???

I created this extension because I wanted to learn or expand my knowledge of the following points:

- Have fun developing vscode extensions with vscode.
- TypeScript
- Compiling with tsc
- esbuild (bundling extensions used in VS Code for Web environments)
- VSCode Testing

| Repository                                                                                                                              | GitHub                                                                                                                                                                                                                                                | Visual Studio Marketplace                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![GitHub release (latest by date)](https://img.shields.io/github/v/release/dennykorsukewitz/VSCode-RainbowColors)                       | ![GitHub open issues](https://img.shields.io/github/issues/dennykorsukewitz/VSCode-RainbowColors) ![GitHub closed issues](https://img.shields.io/github/issues-closed/dennykorsukewitz/VSCode-RainbowColors?color=#44CC44)                            | ![Visual Studio Marketplace last-updated](https://img.shields.io/visual-studio-marketplace/last-updated/dennykorsukewitz.RainbowColors) ![Visual Studio Marketplace Version ](https://img.shields.io/visual-studio-marketplace/v/dennykorsukewitz.RainbowColors) |
| ![GitHub license](https://img.shields.io/github/license/dennykorsukewitz/VSCode-RainbowColors)                                          | ![GitHub pull requests](https://img.shields.io/github/issues-pr/dennykorsukewitz/VSCode-RainbowColors?label=PR) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/dennykorsukewitz/VSCode-RainbowColors?color=g&label=PR) | ![Visual Studio Marketplace Rating release-date](https://img.shields.io/visual-studio-marketplace/release-date/dennykorsukewitz.RainbowColors)                                                                                                                   |
| ![GitHub language count](https://img.shields.io/github/languages/count/dennykorsukewitz/VSCode-RainbowColors?style=flat&label=language) | ![GitHub contributors](https://img.shields.io/github/contributors/dennykorsukewitz/VSCode-RainbowColors)                                                                                                                                              | ![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/dennykorsukewitz.RainbowColors) ![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/dennykorsukewitz.RainbowColors)        |
| ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/dennykorsukewitz/VSCode-RainbowColors)                   | ![GitHub downloads](https://img.shields.io/github/downloads/dennykorsukewitz/VSCode-RainbowColors/total?style=flat)                                                                                                                                   | ![VSC marketplace download](https://img.shields.io/visual-studio-marketplace/d/dennykorsukewitz.RainbowColors) ![VSC marketplace install](https://img.shields.io/visual-studio-marketplace/i/dennykorsukewitz.RainbowColors)                                     |

| Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![GitHub commits since tagged version](https://img.shields.io/github/commits-since/dennykorsukewitz/VSCode-RainbowColors/0.0.4/dev)](https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/0.0.4...dev) ![GitHub Workflow Lint](https://github.com/dennykorsukewitz/VSCode-RainbowColors/actions/workflows/lint.yml/badge.svg?branch=dev&style=flat&label=Lint) ![GitHub Workflow Pages](https://github.com/dennykorsukewitz/VSCode-RainbowColors/actions/workflows/pages.yml/badge.svg?branch=dev&style=flat&label=GitHub%20Pages) |

## Feature

Starts the RainbowColors:

**Shortcut:** `strg + alt + r, s`<br>
**Command:** `RainbowColors: Start.`

Stops the RainbowColors:

**Shortcut:** `strg + alt + r, e`<br>
**Command:** `RainbowColors: Stop.`

![RainbowColors](doc/images/forground.gif)
![RainbowColors](doc/images/background.gif)

### Settings

`Preferences -> Settings -> Extensions -> RainbowColors`

| Name                                | Description                                                                                                    | Default Value |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| `rainbowColors.mode`                | Defines which color change is to be carried. out.                                                              | Foreground    |
| `rainbowColors.interval`            | The interval (in seconds) between change the colors.                                                           | 5             |
| `rainbowColors.numberOfColors`      | Specifies the number of colors to be used for generating the rainbow colors.                                   | 100           |
| `rainbowColors.background`          | Defines which background areas should be changed.                                                              |               |
| `rainbowColors.foreground`          | Defines which foreground (borders and shadows) areas are to be changed.                                        |               |
| `rainbowColors.colorCustomizations` | This is the original colorCustomizations setting. (Overrides colors from the currently selected color theme.). |               |

![Settings](doc/images/settings.png)

---

## Installation

To install this extension, you have **three** options:

### 1. Search Extension in Marketplace

Search and install online extension via VSC extensions menu.

`Code` -> `Preferences` -> `Extensions` simply search for `RainbowColors` to install.

### 2. Install via vsix file

Download latest [vsix file](https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases) and install via extensions menu.

`Code` -> `Preferences` -> `Extensions` -> `Views and More Action` -> `Install from VSIX`.

### 3. Source code

Download archive with the latest [release](https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases) and unpack it to VisualStudioCode extensions folder
`$HOME/.vscode/extensions/`.

---

## Download

For download see [VSCode-RainbowColors](https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases)

---

Enjoy!

Your [Denny Korsukéwitz](https://github.com/dennykorsukewitz) 🚀
