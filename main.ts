// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { hasPermission, Permission } from "@beast/compat/permissions";
import { env } from "@beast/compat/env";
import { osDetails } from "@beast/compat/os";
import { command } from "@beast/compat/command";

function parseEnv(env: string | undefined): boolean {
  return !!env && env !== "0";
}

let NO_COLOR = false;
let FORCE_COLOR = false;
if (await hasPermission(Permission.Env)) {
  NO_COLOR = parseEnv(env("NO_COLOR"));
  FORCE_COLOR = parseEnv(env("FORCE_COLOR"));
} else if ("Deno" in globalThis) {
  // @ts-expect-error Deno is not defined as a type
  NO_COLOR = globalThis.Deno.noColor;
}

const CITrueColor = [
  "GITHUB_ACTIONS",
  "GITEA_ACTIONS",
];

const CIFourBit = [
  "TRAVIS",
  "CIRCLECI",
  "GITLAB_CI",
  "BUILDKITE",
  "DRONE",
  "APPVEYOR",
];

const textDecoder = new TextDecoder();

/** Amount of colors supported by the terminal */
export enum ColorSupport {
  NoColor = 0,
  None = 1,
  ThreeBit = 8,
  FourBit = 16,
  HighColor = 256,
  TrueColor = 16777216,
}

/**
 * Get the color support of the current terminal.
 * To accurately determine color support environment access is recommended.
 *
 * @param [defaultColorSupport=ColorSupport.FourBit] The default color support to return if the terminal color support cannot be determined.
 * @returns The color support of the terminal.
 *
 * @example
 * ```ts
 * import { getColorSupport } from "@crayon/color-support";
 * console.log(await getColorSupport()); // 0 | 1 | 8 | 16 | 256 | 16777216
 * ```
 *
 * @example
 * FORCE_COLOR=1
 * ```ts
 * import { getColorSupport } from "@crayon/color-support";
 * console.log(await getColorSupport()); // 16777216
 * ```
 *
 * @example
 * NO_COLOR=1
 * ```ts
 * import { getColorSupport } from "@crayon/color-support";
 * console.log(await getColorSupport()); // 0
 */
export async function getColorSupport(
  defaultColorSupport = ColorSupport.FourBit,
): Promise<ColorSupport> {
  if (FORCE_COLOR) return ColorSupport.TrueColor;
  else if (NO_COLOR) return ColorSupport.NoColor;

  if (await hasPermission(Permission.Sys, "osRelease")) {
    const details = await osDetails();
    if (details.os === "windows") {
      const { release = 0, version = 0 } = details;
      if (version > 10 || release >= 14931) {
        return ColorSupport.TrueColor;
      }
    }
  }

  let color = -1;

  if (await hasPermission(Permission.Env, "COLORTERM")) {
    switch (env("COLORTERM")) {
      case "":
      case "0":
      case undefined:
        break;
      case "truecolor":
      case "24bit":
        return ColorSupport.TrueColor;
      default:
        color = ColorSupport.FourBit;
        break;
    }
  }

  if (await hasPermission(Permission.Env, "TERM")) {
    const term = env("TERM");
    switch (term) {
      case "iterm":
      case "linux-truecolor":
      case "screen-truecolor":
      case "tmux-truecolor":
      case "xterm-truecolor":
        return ColorSupport.TrueColor;
      default:
        if (term?.startsWith("vte")) {
          return ColorSupport.TrueColor;
        } else if (term?.includes("256")) {
          return ColorSupport.HighColor;
        }
        break;
    }
  }

  if (await hasPermission(Permission.Env, "CI") && env("CI")) {
    for (const ci of CITrueColor) {
      if (await hasPermission(Permission.Env, ci) && parseEnv(env(ci))) {
        return ColorSupport.TrueColor;
      }
    }

    for (const ci of CIFourBit) {
      if (await hasPermission(Permission.Env, ci) && parseEnv(env(ci))) {
        return ColorSupport.FourBit;
      }
    }
  }

  if (await hasPermission(Permission.Run, "tput")) {
    const { success, stdout } = await command("tput", ["colors"], {});
    if (success && stdout) {
      color = Math.max(
        color,
        Number(textDecoder.decode(stdout)) || ColorSupport.None,
      );
    }
  }

  return color === -1 ? defaultColorSupport : color;
}
