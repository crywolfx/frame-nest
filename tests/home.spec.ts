import { expect, test } from "@playwright/test";

test("首页渲染当前路由卡片", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "功能入口中心" })).toBeVisible();
  await expect(page.locator("a[href='/cosmic-moment']").filter({ hasText: "太阳系时间机器" })).toBeVisible();
  await expect(page.locator("a[href='/poster-lab']").filter({ hasText: "月相海报生成" })).toBeVisible();
  await expect(page.locator("a[href='/travel']").filter({ hasText: "路线与准备清单" })).toBeVisible();
  await expect(page.locator("a[href='/travel/hong-kong']").filter({ hasText: "嵌套路由示例" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "宇宙与时间" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "创作工具" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "旅行与地图" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "实验功能" })).toBeVisible();
});

test("首页移动端无横向溢出", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "功能入口中心" })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
