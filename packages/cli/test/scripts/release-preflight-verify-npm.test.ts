import { describe, expect, it, vi } from "vitest";

import {
  VERIFY_NPM_ATTEMPTS,
  retryUntilVisible,
  summarizeCommandError,
  verifyNpmRetryDelayMs,
} from "../../scripts/release-preflight.js";

describe("verify-npm retry window", () => {
  it("backs off for several minutes before giving up", () => {
    const delays: number[] = [];
    for (let attempt = 1; attempt < VERIFY_NPM_ATTEMPTS; attempt += 1) {
      delays.push(verifyNpmRetryDelayMs(attempt));
    }
    const total = delays.reduce((sum, delay) => sum + delay, 0);
    expect(VERIFY_NPM_ATTEMPTS).toBeGreaterThanOrEqual(8);
    expect(delays[0]).toBe(15_000);
    expect(delays[1]).toBe(30_000);
    expect(delays[2]).toBe(60_000);
    expect(delays.at(-1)).toBe(60_000);
    expect(total).toBeGreaterThanOrEqual(5 * 60 * 1000);
    expect(total).toBeLessThanOrEqual(12 * 60 * 1000);
  });

  it("logs each attempt and succeeds once the registry answers", async () => {
    const log = vi.fn();
    const sleepFn = vi.fn(() => Promise.resolve());
    let calls = 0;
    const result = await retryUntilVisible(
      "@sfw003/trellis-core@0.6.18",
      () => {
        calls += 1;
        if (calls < 3) {
          const err = new Error("Command failed: npm view") as Error & {
            stderr?: Buffer;
          };
          err.stderr = Buffer.from(
            "npm error code E404\n@sfw003/trellis-core@0.6.18 is not in this registry\n",
          );
          throw err;
        }
        return "visible";
      },
      { sleepFn, log },
    );

    expect(result).toBe("visible");
    expect(calls).toBe(3);
    expect(sleepFn).toHaveBeenCalledTimes(2);
    expect(sleepFn).toHaveBeenNthCalledWith(1, 15_000);
    expect(sleepFn).toHaveBeenNthCalledWith(2, 30_000);
    const logs = log.mock.calls.map((call) => String(call[0]));
    expect(logs.some((line) => line.includes("attempt 1/"))).toBe(true);
    expect(logs.some((line) => line.includes("attempt 3/"))).toBe(true);
    expect(logs.some((line) => line.includes("not in this registry"))).toBe(
      true,
    );
  });

  it("still fails when the package never becomes visible", async () => {
    const log = vi.fn();
    const sleepFn = vi.fn(() => Promise.resolve());
    let calls = 0;
    await expect(
      retryUntilVisible(
        "@sfw003/trellis@0.6.18",
        () => {
          calls += 1;
          throw new Error(
            "@sfw003/trellis@latest resolves to 0.6.17, expected 0.6.18.",
          );
        },
        { sleepFn, log },
      ),
    ).rejects.toThrow(/expected 0\.6\.18/);
    expect(calls).toBe(VERIFY_NPM_ATTEMPTS);
    expect(sleepFn).toHaveBeenCalledTimes(VERIFY_NPM_ATTEMPTS - 1);
    const logs = log.mock.calls.map((call) => String(call[0]));
    expect(
      logs.some((line) => line.includes(`attempt ${VERIFY_NPM_ATTEMPTS}/`)),
    ).toBe(true);
    expect(logs.some((line) => line.includes("still not visible"))).toBe(true);
  });

  it("does not sleep when the first lookup succeeds", async () => {
    const sleepFn = vi.fn(() => Promise.resolve());
    const result = await retryUntilVisible("pkg@1.0.0", () => "ok", {
      sleepFn,
      log: vi.fn(),
    });
    expect(result).toBe("ok");
    expect(sleepFn).not.toHaveBeenCalled();
  });

  it("summarizes an npm E404 instead of the raw exec dump", () => {
    const err = new Error(
      "Command failed: npm view @sfw003/trellis-core@0.6.18 version",
    ) as Error & { stderr?: Buffer };
    err.stderr = Buffer.from(
      "npm error code E404\n" +
        "npm error 404 Not Found - GET https://registry.npmjs.org/@sfw003%2ftrellis-core\n" +
        "npm error 404 '@sfw003/trellis-core@0.6.18' is not in this registry.\n",
    );
    expect(summarizeCommandError(err)).toMatch(/not in this registry/);
    expect(summarizeCommandError(err)).not.toMatch(/Command failed/);
    expect(summarizeCommandError(err).length).toBeLessThan(300);
  });
});
