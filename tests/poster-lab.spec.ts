import { expect, test, type Page } from "@playwright/test";
import { formatBeijingDateTime, parseBeijingDateAtEvening } from "../app/lib/time";
import { parseBatchRows } from "../app/poster-lab/lib/batch";
import {
  formatLunarDayName,
  lunarDateFromDate,
  lunarMonthDayCountFromDate,
  moonPhaseNameFromDate,
  moonPhaseNameFromLunarDay,
  standardMoonPhaseNames
} from "../app/poster-lab/lib/lunar";
import { moonPhaseFromDate, phaseByIndex, resolvePhaseToken } from "../app/poster-lab/lib/moonPhases";
import { posterInfoLine } from "../app/poster-lab/lib/renderMoonPoster";
import type { MoonPosterConfig } from "../app/poster-lab/lib/types";

test("农历日驱动日期月相、图片档位和月内天数", () => {
  const date = parseBeijingDateAtEvening("2026-05-23");
  expect(date).not.toBeNull();

  const lunar = lunarDateFromDate(date!);
  const phase = moonPhaseFromDate(date!);

  expect(lunar.label).toBe("农历 四月初七");
  expect(lunar.monthDayCount).toBe(29);
  expect(phase.lunarDay).toBe(7);
  expect(phase.phaseIndex).toBe(6);
  expect(phase.phase.nameZh).toBe("上弦月");
  expect(moonPhaseNameFromDate(date!)).toBe("上弦月");
});

test("农历月天数按真实月份返回 29 或 30", () => {
  const shortMonthDate = parseBeijingDateAtEvening("2026-05-23");
  const longMonthDate = parseBeijingDateAtEvening("2026-08-12");
  expect(shortMonthDate).not.toBeNull();
  expect(longMonthDate).not.toBeNull();

  expect(lunarMonthDayCountFromDate(shortMonthDate!)).toBe(29);
  expect(lunarDateFromDate(shortMonthDate!).label).toBe("农历 四月初七");
  expect(lunarMonthDayCountFromDate(longMonthDate!)).toBe(30);
  expect(lunarDateFromDate(longMonthDate!).label).toBe("农历 六月三十");
});

test("批量日期只写日期时按北京时间当天晚上 20:00，auto 按农历日匹配", () => {
  const parsed = parseBatchRows(`2026-05-23 | auto | 默认晚间
2026-05-23 21:30 | auto | 指定时刻
2026-05-23T22:45 | auto | 指定 T 时刻`);

  expect(parsed.warnings).toEqual([]);
  expect(parsed.rows).toHaveLength(3);
  expect(formatBeijingDateTime(parsed.rows[0].date)).toBe("2026-05-23 20:00:00");
  expect(formatBeijingDateTime(parsed.rows[1].date)).toBe("2026-05-23 21:30:00");
  expect(formatBeijingDateTime(parsed.rows[2].date)).toBe("2026-05-23 22:45:00");
  expect(parsed.rows[0].phaseIndex).toBe(6);
  expect(parsed.rows[0].phaseLabel).toBe("上弦月");
});

test("月相固定映射为 8 个标准名称，三十为新月", () => {
  const visibleNames = new Set(standardMoonPhaseNames);

  for (const phase of Array.from({ length: 30 }, (_, index) => phaseByIndex(index))) {
    expect(visibleNames).toContain(phase.nameZh);
    expect(phase.id).toBe(`phase-${String(phase.index + 1).padStart(2, "0")}`);
    expect(phase.slotLabel).toBe(formatLunarDayName(phase.index + 1));
    expect(phase.nameZh).not.toMatch(/盈凸月 01|亏凸月 01|上弦前|近下弦月|亏蛾眉月|晦月|近上弦月|娥眉月/);
  }

  const cases = [
    { lunarDay: 1, expected: "新月" },
    { lunarDay: 2, expected: "蛾眉月" },
    { lunarDay: 7, expected: "上弦月" },
    { lunarDay: 9, expected: "盈凸月" },
    { lunarDay: 15, expected: "满月" },
    { lunarDay: 17, expected: "亏凸月" },
    { lunarDay: 22, expected: "下弦月" },
    { lunarDay: 24, expected: "残月" },
    { lunarDay: 30, expected: "新月" }
  ] as const;

  for (const item of cases) {
    expect(moonPhaseNameFromLunarDay(item.lunarDay)).toBe(item.expected);
    expect(phaseByIndex(item.lunarDay - 1).nameZh).toBe(item.expected);
  }

  const date = parseBeijingDateAtEvening("2026-05-23");
  expect(date).not.toBeNull();
  expect(resolvePhaseToken("phase-00", date!).phaseMode).toBe("date");
  expect(resolvePhaseToken("phase-00", date!).warning).toContain("未识别");
  expect(resolvePhaseToken("0", date!).phaseMode).toBe("date");

  const infoLine = posterInfoLine(infoConfig(date!));
  expect(infoLine).toContain("月相：上弦月");
  expect(infoLine).toContain("农历 四月初七");
  expect(infoLine).toContain("相位 初七（图片档位 7）");
  expect(infoLine).not.toMatch(/娥眉月|月龄约|月龄 0[0-9]|phase-00|00\/29|盈凸月 01|亏凸月 01/);
});

test("AntD 日期时间选择器使用中文面板并更新农历四月初七上弦月", async ({ page }) => {
  await page.goto("/poster-lab");
  await expect(page.getByText("海报实验室")).toBeVisible();
  await expect(page.getByText("月相海报生成器")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出 PNG" }).first()).toBeVisible();

  const dateInput = page.getByLabel("北京时间日期时间");
  await expect(dateInput).toBeVisible();
  await dateInput.click();

  const dropdown = page.locator(".ant-picker-dropdown").filter({ has: page.locator(".ant-picker-panel") });
  await expect(dropdown).toBeVisible();
  await expect(dropdown.getByText(/\d{4}年\d{1,2}月/)).toBeVisible();
  await expect(dropdown.getByText("此刻")).toBeVisible();
  await expect(dropdown.getByText(/确\s*定/)).toBeVisible();
  await expect(dropdown.getByText(/一|二|三|四|五|六|日/).first()).toBeVisible();

  await setAntdDateTime(page, "2026-05-23 21:30");
  await expect(dateInput).toHaveValue("2026-05-23 21:30");
  await expect(page.getByText(/2026-05-23 21:30:00.*农历 四月初七.*日期月相 上弦月.*本月 29 天/)).toBeVisible();
});

test("农历月相卡片按 29/30 天显示传统日期", async ({ page }) => {
  await page.goto("/poster-lab");

  const dateInput = page.getByLabel("北京时间日期时间");
  await setAntdDateTime(page, "2026-05-23 21:30");
  await expect(dateInput).toHaveValue("2026-05-23 21:30");

  await expect(page.getByText("本月 29 天").first()).toBeVisible();
  await expect(page.getByLabel("农历月相").getByRole("button")).toHaveCount(29);
  await expect(page.getByRole("button", { name: "初一 新月" })).toBeVisible();
  await expect(page.getByRole("button", { name: "初二 蛾眉月" })).toBeVisible();
  await expect(page.getByRole("button", { name: "二十 亏凸月" })).toBeVisible();
  await expect(page.getByRole("button", { name: "廿一 亏凸月" })).toBeVisible();
  await expect(page.getByRole("button", { name: "廿九 残月" })).toBeVisible();
  await expect(page.getByRole("button", { name: "三十 新月" })).toHaveCount(0);
  await expect(page.getByLabel("农历月相")).not.toContainText(/\b01\b|\b02\b/);

  await setAntdDateTime(page, "2026-08-12 21:30");
  await expect(page.getByText("本月 30 天").first()).toBeVisible();
  await expect(page.getByLabel("农历月相").getByRole("button")).toHaveCount(30);
  await expect(page.getByRole("button", { name: "三十 新月" })).toBeVisible();
});

test("海报实验室渲染月相预览并可手动选择农历日卡片", async ({ page }) => {
  await page.goto("/poster-lab");
  await expect(page.getByLabel("海报编辑器").getByText("信息标注")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示月相名称")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示农历日期")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示日期")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示相位/农历日")).toBeVisible();
  await expect(page.getByText("事实信息")).toHaveCount(0);
  await expect(page.getByText("每行：日期 | 月相 | 文案")).toBeVisible();
  await expect(page.getByText("auto、phase-01 到 phase-30、1 到 30")).toBeVisible();
  await expect(page.getByText("标注距离")).toBeVisible();
  await expect(page.getByText(/农历 [正二三四五六七八九十冬腊闰]+月/).first()).toBeVisible();
  await expect(page.getByText(/娥眉月|月龄约|phase-00|00\/29|盈凸月 01|亏凸月 01|太阳\/月亮几何|几何档位/)).toHaveCount(0);

  const fontOptions = await page.locator("label:has-text('字体') option").allTextContents();
  expect(fontOptions).toContain("站酷快乐（可爱）");
  expect(fontOptions).toContain("马善政（手写）");
  expect(fontOptions).toContain("站酷庆科黄油（技术）");

  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(900);

  const before = await canvasBrightness(page);
  expect(before.width).toBeGreaterThan(300);
  expect(before.height).toBeGreaterThan(300);
  expect(before.brightness).toBeGreaterThan(1000);

  await page.getByRole("button", { name: "十五 满月" }).click();
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

async function setAntdDateTime(page: Page, value: string) {
  const dateInput = page.getByLabel("北京时间日期时间");
  await dateInput.click();
  await dateInput.fill(value);
  await page.keyboard.press("Enter");

  const okButton = page.locator(".ant-picker-dropdown").getByRole("button", { name: "确定" }).last();
  if (await okButton.isVisible().catch(() => false)) {
    await okButton.click();
  }
}

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

function infoConfig(date: Date): MoonPosterConfig {
  return {
    templateId: "moonPhase",
    date,
    phaseMode: "date",
    phaseIndex: 6,
    text: "月相观测记录",
    font: "sans",
    color: "#fff6dc",
    size: 72,
    x: 0.1,
    y: 0.78,
    align: "left",
    layout: "lowerLeft",
    ratio: "4:5",
    width: 1080,
    height: 1350,
    infoModules: { phaseName: true, lunarDate: true, date: true, phaseIndex: true, illumination: false },
    infoGap: 1.35,
    backgroundStyle: "observatory",
    moonScale: 0.88,
    moonY: 0.42
  };
}
