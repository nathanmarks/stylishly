# Changelog
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.7.0] - 2016-07-30
- Add `inlineStyleHook` to pluginRegistry and `prepareInline` function to stylemanager. `prepareInline` takes either an object or a function callback with theme passed as an arg.
- Update vendor prefixer to latest inline-style-prefixer and change to static version by default. Dynamic prefixer can be passed as a prefix function if desired.


## [0.6.0] - 2016-07-16
- Replaced `renderSheetsToString` with `renderSheetsToCSS`, and returns an object keyed by group name with the css strings to place in tags.
- multi-selector support was super buggy, so I've removed it for now until I have time to develop a better implementation.
- Fixed a number of bugs with `@raw` selectors.
- Simplified selector resolution.
- Refactored a lot of plugin code.
- Merged `stylishly-media-queries` and `stylishly-keyframes` into `stylishly-at-rules`.
- Merged `stylishly-descendants` and `stylishly-chained` into `stylishly-nested`.
- Added the ability to reset the renderer and re-render all the sheets using styleManager.
- Added a warning when rendering a stylesheet using the same name.
