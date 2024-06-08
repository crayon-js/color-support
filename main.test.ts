// Copyright 2024 Im-Beast. All rights reserved. MIT license.
/// <reference lib="deno.ns" />

import { assertEquals } from "@std/assert";
import { ColorSupport, getColorSupport } from "./main.ts";

function resetEnv(): void {
  Deno.env.delete("COLORTERM");
  Deno.env.delete("TERM");
  Deno.env.delete("CI");
  Deno.env.delete("NO_COLOR");
  Deno.env.delete("FORCE_COLOR");
}

async function subTest(
  t: Deno.TestContext,
  variables: [keys: string[], values: string[]][],
  expected: ColorSupport,
) {
  for (const [keys, values] of variables) {
    for (const value of values) {
      const keyTitle = keys.length > 1 ? `[${keys}]` : keys[0];

      await t.step(
        `\x1b[33m${keyTitle}\x1b[0m=\x1b[36m${value}\x1b[0m`,
        async () => {
          resetEnv();
          for (const key of keys) {
            Deno.env.set(key, value);
          }

          assertEquals(await getColorSupport(), expected);

          for (const key of keys) {
            Deno.env.delete(key);
          }
        },
      );
    }
  }
}

Deno.test("TrueColor", async (t) => {
  await subTest(t, [
    [["COLORTERM"], ["truecolor", "24bit"]],
    // deno-fmt-ignore
    [["TERM"], ["iterm", "linux-truecolor", "screen-truecolor", "tmux-truecolor", "xterm-truecolor", "vte-truecolor"]],
    [["CI", "GITHUB_ACTIONS"], ["TRUE", "1"]],
    [["CI", "GITEA_ACTIONS"], ["TRUE", "1"]],
    [["FORCE_COLOR"], ["1", "TRUE"]],
  ], ColorSupport.TrueColor);
});

Deno.test("HighColor", async (t) => {
  await subTest(t, [
    // deno-fmt-ignore
    [["TERM"], ["linux-256", "screen-256", "tmux-256", "xterm-256", "xterm", "rxvt", "tmux", "putty", "teken" ]],
  ], ColorSupport.HighColor);
});

Deno.test("FourBit", async (t) => {
  await subTest(t, [
    [["COLORTERM"], ["4bit"]],
    [["CI", "TRAVIS"], ["1", "TRUE"]],
    [["CI", "CIRCLECI"], ["1", "TRUE"]],
    [["CI", "GITLAB_CI"], ["1", "TRUE"]],
    [["CI", "BUILDKITE"], ["1", "TRUE"]],
    [["CI", "DRONE"], ["1", "TRUE"]],
    [["CI", "APPVEYOR"], ["1", "TRUE"]],
  ], ColorSupport.FourBit);
});

Deno.test("None", async (t) => {
  await subTest(t, [
    [["TERM"], ["DUMB"]],
  ], ColorSupport.None);
});

Deno.test("NoColor", async (t) => {
  await subTest(t, [
    [["NO_COLOR"], ["1"]],
  ], ColorSupport.NoColor);
});
