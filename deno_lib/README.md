<font size="6"><p align="center"><b>🖍️ Crayon.js color support for 🦕 Deno</b></p></font>
<hr />

## :books: About
##### This package is extension for [crayon.js](https://github.com/crayon-js/crayon) however it can still be used by other packages.

## Syntax
```ts
interface CrayonColorSupport {
	threeBitColor: boolean
	fourBitColor: boolean
	highColor: boolean
	trueColor: boolean
}
```

## Usage
```ts
import { getColorSupport, supportedColors, getWindowsVersion } from 'https://deno.land/x/crayon-color-support/mod.ts';

const support = getColorSupport(); // detect terminal color support
const cached = supportedColors(); // cached getColorSupport (it just returns cached object)
const windowsVersion = getWindowsVersion(); // Reusable function [version (7/8/10...), versionId (14931...)], empty if detected system is not Windows
```

## Usage with crayon.js
```ts
import crayon from 'https://deno.land/x/crayon/mod.ts'; // it'll still work with modules that extend crayon instance as its config is global
import { getColorSupport } from 'https://deno.land/x/crayon-color-support/mod.ts';

crayon.config.colorSupport = getColorSupport();
```

### Wiki
To learn more about Crayon and its API look [here](https://github.com/crayon-js/crayon/wiki)

## :handshake: Contributing
#### Feel free to add any commits, issues and pull requests

## :memo: Licensing
#### This project is available under MIT License conditions.