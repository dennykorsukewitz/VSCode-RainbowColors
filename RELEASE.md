# [1.0.0] - 2024-04-19

## Added

- Added new command `RainbowColors.pause` to pause the interval for the current color.
- Added new command `RainbowColors.remove` to remove RainbowColors from the workbench.colorCustomizations settings.
- Added new setting `rainbowColors.event` - Defines which event executes the RainbowColor function.
- Added new setting `rainbowColors.numberOfKeystrokes` - Specifies the number of keystrokes that must be performed before the colors changes.
- Added 'auto start onStartupFinished' for `interval` event.
- Reload window after changing the settings `rainbowColors.event` and `rainbowColors.mode` with command `workbench.action.reloadWindow`.

## Changed

- Screenshots
- `primaryColor` and `complementaryColor` function have been separated.
