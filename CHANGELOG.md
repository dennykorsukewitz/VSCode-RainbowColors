# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Added description for `rainbowColors.event` to README.md

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
- Added and updated VSCode internal launch and task.
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
