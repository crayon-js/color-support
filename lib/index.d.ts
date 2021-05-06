interface CrayonColorSupport {
    threeBitColor: boolean;
    fourBitColor: boolean;
    highColor: boolean;
    trueColor: boolean;
}
export declare const getWindowsVersion: () => number[];
export declare const supportedColors: () => CrayonColorSupport;
export declare const getColorSupport: () => CrayonColorSupport;
export {};
