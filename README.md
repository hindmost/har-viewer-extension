# har-viewer-extension

Source code of HAR/JSON viewer browser extension ([Chrome](https://chrome.google.com/webstore/detail/harjson-viewer/bghceahjdhjncoohgobeohgnmfnooibd?hl=en-US)/[Firefox](https://addons.mozilla.org/addon/har-json-viewer/)/Opera/Edge).

Based on [HAR Viewer](https://github.com/janodvarko/harviewer).


## How to build

Clone this repository into a local folder, then run there:

```
npm install
npm run build
```

As a result, `dist/chrome` folder will contain the extension package for Chrome, whereas `dist/firefox` - for Firefox (also compatible with Opera/Edge).

### Pre-built resources

`public/harviewer` folder contains HAR Viewer web application that is pre-built from [`hindmost/harviewer`](https://github.com/hindmost/harviewer), a custom modification (fork) of HAR Viewer.

In order to reproduce the contents of `public/harviewer` folder:

1. Clone [`hindmost/harviewer`](https://github.com/hindmost/harviewer) into a local folder.

2. Run inside the clone folder:

```
npm install
npm run build
```

3. Copy the following files from the `hindmost/harviewer` clone to `public/harviewer` folder:

```
webapp-build/
  license.txt
  css/
    harViewer.css
    images/
      bg-button.gif
      netBarCached.gif
      netBarLoaded.gif
      spriteArrows.gif
      contextMenuTarget.png
      contextMenuTargetHover.png
      page-timeline.png
      save.png
      splitterh.png
      spriteArrows.png
      tabEnabled.png
      timeline-sprites.png
      tooltipConnectorUp.png
      twisty-sprites.png
      menu/
        shadowAlpha.png
        tabMenuCheckbox.png
        tabMenuPin.png
        tabMenuRadio.png
  scripts/
    harViewer.js
    jquery.js
    require.js
    highlightjs/
      highlight.min.js
```


## License

Licensed under the MIT license.
