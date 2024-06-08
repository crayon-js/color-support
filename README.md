# 🎨 Color support

Terminal color support detection package.\
Supports [NO_COLOR](https://no-color.org/) and
[FORCE_COLOR](https://force-color.org/).

## 🌈 Usage

```ts
import { ColorSupport, getColorSupport } from "@crayon/color-support";

const colors = await getColorSupport();
console.log(colors); // Prints amount of colors supported by current terminal

switch (colors) {
  case ColorSupport.TrueColor:
    console.log("over 16mil colors!");
    break;
  case ColorSupport.HighColor:
    console.log("255 colors");
    break;
  case ColorSupport.FourBit:
    console.log("16 colors..");
    break;
  case ColorSupport.ThreeBit:
    console.log("8 colors :/");
    break;
  default:
    console.log("No colors :(");
    break;
}
```

## 🖍 Crayon

This module is made as a first party extension for
[Crayon](https://github.com/crayon-js/crayon), terminal styling package.

## 📝 Licensing

This project is available under **MIT** License conditions.
