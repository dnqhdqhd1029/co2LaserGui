import { test, expect } from "@playwright/test";
import { mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";

const EXPORT_DIR = path.resolve(process.cwd(), "exports");
const TARGET_FRAME_ID = process.env.EXPORT_FRAME_ID?.trim();

function safeFilename(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[<>:"/\\|?*]/g, "-");
}

test("export every HMI screen state as a 1024x768 PNG", async ({ page }) => {
  await mkdir(EXPORT_DIR, { recursive: true });
  const previousFiles = await readdir(EXPORT_DIR);
  await Promise.all(
    previousFiles
      .filter((filename) => filename.toLowerCase().endsWith(".png"))
      .map((filename) => unlink(path.join(EXPORT_DIR, filename))),
  );
  await page.goto("/", { waitUntil: "networkidle" });

  await page.locator('[data-section-id="07"]').click();
  await page.locator('[data-frame-id="SCR-001"]').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const frameButtons = page.locator("[data-frame-id]");
  const frames = await frameButtons.evaluateAll((buttons) =>
    buttons
      .map((button) => ({
        id: button.getAttribute("data-frame-id") ?? "screen",
        name: button.getAttribute("data-frame-name") ?? "state",
      }))
      .filter((frame) => frame.id !== "LIVE"),
  );

  const targetFrames = TARGET_FRAME_ID
    ? frames.filter((frame) => frame.id === TARGET_FRAME_ID)
    : frames;

  expect(targetFrames.length, `Unknown frame id: ${TARGET_FRAME_ID}`).toBeGreaterThan(0);

  for (const [index, frame] of targetFrames.entries()) {
    await page.locator(`[data-frame-id="${frame.id}"]`).click();

    const screenFrame = page.locator('[data-screen-frame="true"]');
    await expect(screenFrame).toHaveCount(1);
    await expect(screenFrame).toHaveCSS("width", "1024px");
    await expect(screenFrame).toHaveCSS("height", "768px");
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    });

    const sequence = String(index + 1).padStart(3, "0");
    const filename = `${sequence}_${safeFilename(frame.id)}_${safeFilename(frame.name)}.png`;
    await screenFrame.screenshot({
      path: path.join(EXPORT_DIR, filename),
      type: "png",
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  }
});
