import { expect, test } from "@playwright/test";

test("海报实验室渲染月相预览并可切换相位", async ({ page }) => {
  await page.goto("/poster-lab");
  await expect(page.getByText("海报实验室")).toBeVisible();
  await expect(page.getByText("月相海报生成器")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出 PNG" }).first()).toBeVisible();

  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(900);

  const before = await canvasBrightness(page);
  expect(before.width).toBeGreaterThan(300);
  expect(before.height).toBeGreaterThan(300);
  expect(before.brightness).toBeGreaterThan(1000);

  await page.getByRole("button", { name: /上弦月 月龄 09/ }).click();
  await page.waitForTimeout(700);

  const after = await canvasBrightness(page);
  expect(after.brightness).toBeGreaterThan(1000);
  expect(Math.abs(after.brightness - before.brightness)).toBeGreaterThan(100);
});

test("海报实验室移动端无横向溢出", async ({ page }) => {
  await page.goto("/poster-lab");
  await expect(page.getByText("月相海报生成器")).toBeVisible();
  await expect(page.getByRole("button", { name: /批量生成|全部生成/ }).first()).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

async function canvasBrightness(page: { evaluate: <T>(fn: () => T) => Promise<T> }) {
  return page.evaluate(() => {
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
}
