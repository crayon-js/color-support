# 🎨 Color support

Terminal color support detection package.\
Supports [NO_COLOR](https://no-color.org/) and [FORCE_COLOR](https://force-color.org/).

Made primarily for use with [Crayon](https://github.com/crayon-js/crayon)

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

## 🤝 Contributing

**Crayon** is open for any contributions.\
If you feel like you can enhance this project - please open an issue and/or pull request.\
Code should be well document and easy to follow what's going on.

**Crayon 4.x** follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).\
If your pull request's code could introduce understandability trouble, please add comments to it.

## 📝 Licensing

This project is available under **MIT** License conditions.
