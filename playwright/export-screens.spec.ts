import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const EXPORT_DIR = path.resolve(process.cwd(), "exports");

function safeFilename(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[<>:"/\\|?*]/g, "-");
}

test("export every HMI screen state as a 1024x768 PNG", async ({ page }) => {
  await mkdir(EXPORT_DIR, { recursive: true });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.locator('[data-section-id="07"]').click();
  await page.locator('[data-frame-id="SCR-001"]').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const frameButtons = page.locator("[data-frame-id]");
  const frames = await frameButtons.evaluateAll((buttons) =>
    buttons.map((button) => ({
      id: button.getAttribute("data-frame-id") ?? "screen",
      name: button.getAttribute("data-frame-name") ?? "state",
    })),
  );

  for (const frame of frames) {
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

    const filename = `${safeFilename(frame.id)}_${safeFilename(frame.name)}.png`;
    await screenFrame.screenshot({
      path: path.join(EXPORT_DIR, filename),
      type: "png",
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  }
});
