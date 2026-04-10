# Release

## [2.0.0] - 2025-08-31

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
