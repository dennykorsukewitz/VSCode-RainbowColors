# RainbowColors

<img align="right" width="150" height="150" src="doc/images/Icon.png" alt="RainbowColors Icon">

**RainbowColors** is an extension that changes the foreground or background color rainbowly after a certain interval or a few keystrokes have been made.

## Why???

I created this extension because I wanted to learn or expand my knowledge of the following points:

- Have fun developing Visual Studio Code extensions with Visual Studio Code.
- TypeScript
- Compiling with tsc
- esbuild (bundling extensions used in Visual Studio Code for Web environments)
- Visual Studio Code Testing

| Repository| GitHub | Visual Studio Marketplace |
| --- | --- | --- |
| ![GitHub release (latest by date)](https://img.shields.io/github/v/release/dennykorsukewitz/VSCode-RainbowColors) | ![GitHub open issues](https://img.shields.io/github/issues/dennykorsukewitz/VSCode-RainbowColors) ![GitHub closed issues](https://img.shields.io/github/issues-closed/dennykorsukewitz/VSCode-RainbowColors?color=#44CC44) | ![Visual Studio Marketplace last-updated](https://img.shields.io/visual-studio-marketplace/last-updated/dennykorsukewitz.RainbowColors) ![Visual Studio Marketplace Version ](https://img.shields.io/visual-studio-marketplace/v/dennykorsukewitz.RainbowColors) |
| ![GitHub license](https://img.shields.io/github/license/dennykorsukewitz/VSCode-RainbowColors) | ![GitHub pull requests](https://img.shields.io/github/issues-pr/dennykorsukewitz/VSCode-RainbowColors?label=PR) ![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/dennykorsukewitz/VSCode-RainbowColors?color=g&label=PR) | ![Visual Studio Marketplace Rating release-date](https://img.shields.io/visual-studio-marketplace/release-date/dennykorsukewitz.RainbowColors) |
| ![GitHub language count](https://img.shields.io/github/languages/count/dennykorsukewitz/VSCode-RainbowColors?style=flat&label=language) | ![GitHub contributors](https://img.shields.io/github/contributors/dennykorsukewitz/VSCode-RainbowColors) | ![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/dennykorsukewitz.RainbowColors) ![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/dennykorsukewitz.RainbowColors) |
| ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/dennykorsukewitz/VSCode-RainbowColors) | ![GitHub downloads](https://img.shields.io/github/downloads/dennykorsukewitz/VSCode-RainbowColors/total?style=flat) | ![VSC marketplace download](https://img.shields.io/visual-studio-marketplace/d/dennykorsukewitz.RainbowColors) ![VSC marketplace install](https://img.shields.io/visual-studio-marketplace/i/dennykorsukewitz.RainbowColors)                                     |

| Status |
| --- |
| [![GitHub commits since tagged version](https://img.shields.io/github/commits-since/dennykorsukewitz/VSCode-RainbowColors/2.0.0/dev)](https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/2.0.0...dev) ![GitHub Workflow Lint](https://github.com/dennykorsukewitz/VSCode-RainbowColors/actions/workflows/lint.yml/badge.svg?branch=dev&style=flat&label=Lint) ![GitHub Workflow Pages](https://github.com/dennykorsukewitz/VSCode-RainbowColors/actions/workflows/pages.yml/badge.svg?branch=dev&style=flat&label=GitHub%20Pages) |

## Feature

The `rainbowColors.event` setting defines which event triggers the RainbowColors function. This event determines when the foreground or background color changes in a rainbow pattern. The available options for this setting are `interval` and `keystrokes`.

When set to `interval`, the colors will change at a specified time interval.
When set to `keystrokes`, the colors will change after a certain number of keystrokes have been made.
You can customize this setting according to your preference by modifying the value of `rainbowColors.event` in the extension's settings.

### Start RainbowColors

Starts the rainbow colors animation.

**Shortcut:** `strg + alt + r, s`<br>
**Command:** `RainbowColors: Start.`

### Stop RainbowColors

Stops the rainbow colors animation and restores the original color customizations `workbench.colorCustomizations`.

**Shortcut:** `strg + alt + r, e`<br>
**Command:** `RainbowColors: Stop.`

### Pause RainbowColors

Pauses the rainbow colors animation.
The current color remains the same.

**Shortcut:** `strg + alt + r, p`<br>
**Command:** `RainbowColors: Pause.`

### Remove RainbowColors

Removes rainbow colors from the Visual Studio Code workspace `workbench.colorCustomizations`.

**Shortcut:** `strg + alt + r, q`<br>
**Command:** `RainbowColors: Remove.`

![RainbowColors](doc/images/Keystrokes.gif)
![RainbowColors](doc/images/Foreground.gif)
![RainbowColors](doc/images/Background.gif)

### Settings

`Preferences -> Settings -> Extensions -> RainbowColors`

| Name                                | Description                                                                                                    | Default Value |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| `rainbowColors.event`                | Defines which event executes the RainbowColor function.                                                              | interval    |
| `rainbowColors.mode`                | Defines which color change is to be carried out.                                                              | foreground    |
| `rainbowColors.interval`            | The interval (in seconds) between change the colors.                                                           | 5             |
| `rainbowColors.numberOfKeystrokes`      | Specifies the number of keystrokes that must be performed before the colors changes.                                   | 3           |
| `rainbowColors.numberOfColors`      | Specifies the number of colors to be used for generating the rainbow colors.                                   | 100           |
| `rainbowColors.background`          | Defines which background areas should be changed.                                                              |               |
| `rainbowColors.foreground`          | Defines which foreground (borders and shadows) areas are to be changed.                                        |               |
| `rainbowColors.colorCustomizations` | This is the original colorCustomizations setting. (Overrides colors from the currently selected color theme.). |               |

![Settings](doc/images/Settings.png)

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

Download archive with the latest [release](https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases) and unpack it to Visual Studio Code extensions folder
`$HOME/.vscode/extensions/`.

---

## Download

For download see [VSCode-RainbowColors](https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases)

---

Enjoy!

Your [Denny Korsukéwitz](https://github.com/dennykorsukewitz) 🚀
