# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-08-31

### Features

- **configuration**: Extended JSON schema definitions for all Visual Studio Code color configurations
  - Added schema for over 300 background color tokens
  - Added schema for over 200 foreground color tokens
  - Added schema for custom color configurations
  - Improved user experience with detailed descriptions for all color options

- **events**: New `one-time` event mode
  - Allows one-time setting of rainbow colors without timer or keyboard events
  - Color counter reset on one-time execution

### Enhancements

- **configuration**: Improved configuration structure
  - `interval.time` replaces `interval` for better readability
  - `keystroke.numberOfKeystrokes` replaces `numberOfKeystrokes` for more structured settings

- **code**: Improved code organization
  - Variable initialization refactoring
  - Removal of redundant code blocks
  - Improved function for removing rainbow colors
  - Removal of debug console outputs

- **user experience**: Enhanced user interaction
  - Automatic extension restart after configuration changes
  - Combined commands for seamless reconfiguration (`remove` → `reload` → `start`)

### Documentation

- **comprehensive guides**: New comprehensive documentation
  - `doc/all.md` - Complete overview of all available color options
  - `doc/background.md` - Special documentation for background colors
  - `doc/foreground.md` - Special documentation for foreground colors
  - `doc/custom.md` - Guide for custom color configurations

### Dependencies

- Bump @vscode/test-cli from 0.0.4 to 0.0.10 (#1)
- Bump esbuild from 0.20.2 to 0.25.2 (#17)
- Bump @types/node from 18.19.86 to 22.13.17 (#18)
- Bump @typescript-eslint/eslint-plugin from 6.21.0 to 8.29.0 (#20)
- Bump @typescript-eslint/parser from 6.21.0 to 8.29.0 (#19)

### Bugfixes

- **configuration**: Correct handling of configuration structure
- **keystroke handling**: Improved handling of keyboard events without debug outputs

### ⚠️ Breaking Changes

- **configuration**: Configuration keys were renamed for better structure:
  - `rainbowColors.interval` → `rainbowColors.interval.time`
  - `rainbowColors.numberOfKeystrokes` → `rainbowColors.keystroke.numberOfKeystrokes`

## [1.0.1] - 2024-04-23

### Changed

- Added description for `rainbowColors.event` to README.md
- Added keystrokes.gif and improved function description.
- Updated icon.
- Added 'configuration changed' dialog.

## [1.0.0] - 2024-04-19

### Added

- Added new command `RainbowColors.pause` to pause the interval for the current color.
- Added new command `RainbowColors.remove` to remove RainbowColors from the workbench.colorCustomizations settings.
- Added new setting `rainbowColors.event` - Defines which event executes the RainbowColor function.
- Added new setting `rainbowColors.numberOfKeystrokes` - Specifies the number of keystrokes that must be performed before the colors changes.
- Added 'auto start onStartupFinished' for `interval` event.
- Reload window after changing the settings `rainbowColors.event` and `rainbowColors.mode` with command `workbench.action.reloadWindow`.

### Changed

- Screenshots
- `primaryColor` and `complementaryColor` function have been separated.

## [0.0.4] - 2024-02-01

### Changed

- Tidied Package and fixed small bug.

## [0.0.3] - 2024-02-01

### Changed

- Use rainbow-colors-array-ts instead of rainbow-colors-array.
- Added and updated Visual Studio Code internal launch and task.
- Tidied Package.

## [0.0.2] - 2024-02-01

### Changed

- Updated README.md.
- Added browser entry point.

## [0.0.1] - 2024-01-31

### Added

- Initial release of RainbowColors extension.
- `RainbowColors` is an extension that changes the foreground or background color rainbowly after a certain interval.

[1.0.0]: https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/0.0.4...1.0.0
[0.0.4]: https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/0.0.3...0.0.4
[0.0.3]: https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/0.0.2...0.0.3
[0.0.2]: https://github.com/dennykorsukewitz/VSCode-RainbowColors/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/dennykorsukewitz/VSCode-RainbowColors/releases/tag/0.0.1
