import { expect, test } from "@playwright/test";

test("宇宙此刻渲染可交互且非空白的宇宙场景", async ({ page }) => {
  await page.goto("/cosmic-moment");
  await expect(page.getByText("宇宙此刻")).toBeVisible();
  await expect(page.getByRole("button", { name: /导出/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "NASA 拟真" })).toBeVisible();

  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(1400);

  const sample = await page.evaluate(() => {
    const source = document.querySelector("canvas");
    if (!source) return { width: 0, height: 0, brightness: 0 };

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { width: source.clientWidth, height: source.clientHeight, brightness: 0 };

    ctx.drawImage(source, 0, 0, 64, 64);
    const pixels = ctx.getImageData(0, 0, 64, 64).data;
    let brightness = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      brightness += pixels[index] + pixels[index + 1] + pixels[index + 2];
    }

    return { width: source.clientWidth, height: source.clientHeight, brightness };
  });

  expect(sample.width).toBeGreaterThan(300);
  expect(sample.height).toBeGreaterThan(300);
  expect(sample.brightness).toBeGreaterThan(1000);
});
