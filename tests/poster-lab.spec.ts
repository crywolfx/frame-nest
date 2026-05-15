import { expect, test } from "@playwright/test";
import { formatBeijingDateTime, parseBeijingDateAtEvening } from "../app/lib/time";
import { parseBatchRows } from "../app/poster-lab/lib/batch";
import { lunarDateFromDate, moonPhaseNameFromDate, moonPhaseNameFromLunarDay, standardMoonPhaseNames } from "../app/poster-lab/lib/lunar";
import { moonPhaseFromDate, phaseByIndex, resolvePhaseToken } from "../app/poster-lab/lib/moonPhases";
import { posterInfoLine } from "../app/poster-lab/lib/renderMoonPoster";
import type { MoonPosterConfig } from "../app/poster-lab/lib/types";

test.describe("月相几何相位计算（中国时间晚上）", () => {
  const cases = [
    { date: "2026-05-01", name: "满月附近", minIndex: 14, maxIndex: 16, minIllumination: 0.9 },
    { date: "2026-05-09", name: "下弦附近", minIndex: 21, maxIndex: 24 },
    { date: "2026-05-15", name: "亏蛾眉或残月", minIndex: 27, maxIndex: 29, maxIllumination: 0.18 },
    { date: "2026-05-16", name: "新月边界", allowedIndexes: [0, 29], maxIllumination: 0.08 },
    { date: "2026-05-23", name: "上弦附近", minIndex: 7, maxIndex: 9 },
    { date: "2026-05-31", name: "满月附近", minIndex: 14, maxIndex: 16, minIllumination: 0.9 }
  ];

  for (const item of cases) {
    test(`${item.date} 中国时间晚上 20:00 => ${item.name}`, () => {
      const date = parseBeijingDateAtEvening(item.date);
      expect(date).not.toBeNull();
      const result = moonPhaseFromDate(date!);

      if ("allowedIndexes" in item) {
        expect(item.allowedIndexes).toContain(result.phaseIndex);
      } else {
        expect(result.phaseIndex).toBeGreaterThanOrEqual(item.minIndex);
        expect(result.phaseIndex).toBeLessThanOrEqual(item.maxIndex);
      }

      if (item.minIllumination !== undefined) expect(result.illumination).toBeGreaterThanOrEqual(item.minIllumination);
      if (item.maxIllumination !== undefined) expect(result.illumination).toBeLessThanOrEqual(item.maxIllumination);
    });
  }
});

test("批量日期只写日期时按北京时间当天晚上 20:00", () => {
  const parsed = parseBatchRows(`2026-05-23 | auto | 默认晚间
2026-05-23 21:30 | auto | 指定时刻
2026-05-23T22:45 | auto | 指定 T 时刻`);

  expect(parsed.warnings).toEqual([]);
  expect(parsed.rows).toHaveLength(3);
  expect(formatBeijingDateTime(parsed.rows[0].date)).toBe("2026-05-23 20:00:00");
  expect(formatBeijingDateTime(parsed.rows[1].date)).toBe("2026-05-23 21:30:00");
  expect(formatBeijingDateTime(parsed.rows[2].date)).toBe("2026-05-23 22:45:00");
});

test("月相展示名称归并为 8 个标准名称，编号按 1-based 显示", () => {
  const visibleNames = new Set(standardMoonPhaseNames);

  for (const phase of Array.from({ length: 30 }, (_, index) => phaseByIndex(index))) {
    expect(visibleNames).toContain(phase.nameZh);
    expect(phase.id).toBe(`phase-${String(phase.index + 1).padStart(2, "0")}`);
    expect(phase.nameZh).not.toMatch(/盈凸月 01|亏凸月 01|上弦前|近下弦月|亏蛾眉月|晦月|近上弦月/);
  }

  const date = parseBeijingDateAtEvening("2026-05-23");
  expect(date).not.toBeNull();
  expect(resolvePhaseToken("phase-00", date!).phaseMode).toBe("date");
  expect(resolvePhaseToken("phase-00", date!).warning).toContain("未识别");
  expect(resolvePhaseToken("0", date!).phaseMode).toBe("date");

  const infoConfig: MoonPosterConfig = {
    templateId: "moonPhase",
    date: date!,
    phaseMode: "date",
    phaseIndex: 7,
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

  const infoLine = posterInfoLine(infoConfig);
  expect(infoLine).toContain("月相：上弦月");
  expect(infoLine).toContain("农历 四月初七");
  expect(infoLine).toContain("相位 09/30");
  expect(infoLine).not.toMatch(/月龄约|月龄 0[0-9]|相位 00\/29|盈凸月 01|亏凸月 01/);
});

test("农历日范围映射到 8 个固定月相名称", () => {
  const cases = [
    { lunarDay: 1, expected: "新月" },
    { lunarDay: 2, expected: "蛾眉月" },
    { lunarDay: 7, expected: "上弦月" },
    { lunarDay: 9, expected: "盈凸月" },
    { lunarDay: 15, expected: "满月" },
    { lunarDay: 17, expected: "亏凸月" },
    { lunarDay: 22, expected: "下弦月" },
    { lunarDay: 24, expected: "残月" }
  ] as const;

  for (const item of cases) {
    const date = findBeijingDateForLunarDay(item.lunarDay);
    expect(moonPhaseNameFromLunarDay(item.lunarDay)).toBe(item.expected);
    expect(lunarDateFromDate(date).day).toBe(item.lunarDay);
    expect(moonPhaseNameFromDate(date)).toBe(item.expected);
  }
});

test("海报实验室渲染月相预览并可切换相位", async ({ page }) => {
  await page.goto("/poster-lab");
  await expect(page.getByText("海报实验室")).toBeVisible();
  await expect(page.getByText("月相海报生成器")).toBeVisible();
  await expect(page.getByRole("button", { name: "导出 PNG" }).first()).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("信息标注")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示月相名称")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示农历日期")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示日期")).toBeVisible();
  await expect(page.getByLabel("海报编辑器").getByText("显示相位编号")).toBeVisible();
  await expect(page.getByText("事实信息")).toHaveCount(0);
  const fontOptions = await page.locator("label:has-text('字体') option").allTextContents();
  expect(fontOptions).toContain("站酷快乐（可爱）");
  expect(fontOptions).toContain("马善政（手写）");
  expect(fontOptions).toContain("站酷庆科黄油（技术）");
  await expect(page.getByText("每行：日期 | 月相 | 文案")).toBeVisible();
  await expect(page.getByText("auto、phase-01 到 phase-30、1 到 30")).toBeVisible();
  await expect(page.getByText("太阳/月亮几何相位估算")).toBeVisible();
  await expect(page.getByText("标注距离")).toBeVisible();
  await expect(page.getByText(/农历 [正二三四五六七八九十冬腊闰]+月/).first()).toBeVisible();
  await expect(page.getByText(/盈凸月 01|亏凸月 01|相位 00\/29|近上弦月|亏蛾眉月|晦月/)).toHaveCount(0);

  const dateInput = page.getByLabel("北京时间日期时间");
  await expect(dateInput).toBeVisible();
  expect(await dateInput.inputValue()).toMatch(/^\d{4}-\d{2}-\d{2} 20:00$/);

  const viewport = page.viewportSize();
  if (!viewport || viewport.width >= 900) {
    const dateInputReceivesPointer = await dateInput.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return target === element || element.contains(target);
    });
    expect(dateInputReceivesPointer).toBe(true);
  }

  await dateInput.click();
  await expect(page.locator(".react-datepicker")).toBeVisible();
  await expect(page.locator(".react-datepicker__time-container")).toBeVisible();

  const dayButton = page.locator(".react-datepicker__day--023:not(.react-datepicker__day--outside-month)");
  await expect(dayButton).toHaveCount(1);
  await dayButton.click();

  const timeOption = page.locator(".react-datepicker__time-list-item", { hasText: "21:30" });
  await expect(timeOption).toHaveCount(1);
  await timeOption.click();
  await expect(dateInput).toHaveValue("2026-05-23 21:30");
  await expect(page.getByText(/2026-05-23 21:30:00.*农历 四月初七.*日期月相 上弦月/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".react-datepicker")).toHaveCount(0);

  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  await page.waitForTimeout(900);

  const before = await canvasBrightness(page);
  expect(before.width).toBeGreaterThan(300);
  expect(before.height).toBeGreaterThan(300);
  expect(before.brightness).toBeGreaterThan(1000);

  await page.getByRole("button", { name: /满月 相位 16/ }).click();
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

function findBeijingDateForLunarDay(lunarDay: number) {
  const start = parseBeijingDateAtEvening("2026-05-17");
  expect(start).not.toBeNull();

  for (let offset = 0; offset < 40; offset += 1) {
    const date = new Date(start!.getTime() + offset * 86_400_000);
    if (lunarDateFromDate(date).day === lunarDay) return date;
  }

  throw new Error(`未找到农历 ${lunarDay} 对应的测试日期`);
}
