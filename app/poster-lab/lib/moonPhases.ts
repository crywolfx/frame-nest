export const synodicMonthDays = 29.530588853;
const referenceNewMoonMs = Date.UTC(2000, 0, 6, 18, 14, 0);
const dayMs = 86_400_000;

export type MoonPhase = {
  id: string;
  index: number;
  nameZh: string;
  lunarDayLabel: string;
  assetPath: string;
  expectedLitSide: string;
  expectedIllumination: number;
  phaseAngleDeg: number;
};

const phaseRows = [
  ["moon-phase-00-new-moon.webp", "新月", "月龄 01", "无明显亮面"],
  ["moon-phase-01-waxing-crescent-01.webp", "细盈蛾眉月", "月龄 02", "右侧"],
  ["moon-phase-02-waxing-crescent-02.webp", "盈蛾眉月 02", "月龄 03", "右侧"],
  ["moon-phase-03-waxing-crescent-03.webp", "盈蛾眉月 03", "月龄 04", "右侧"],
  ["moon-phase-04-waxing-crescent-04.webp", "盈蛾眉月 04", "月龄 05", "右侧"],
  ["moon-phase-05-waxing-moon-05.webp", "盈月 05", "月龄 06", "右侧"],
  ["moon-phase-06-near-first-quarter.webp", "近上弦月", "月龄 07", "右侧"],
  ["moon-phase-07-before-first-quarter.webp", "上弦前", "月龄 08", "右侧"],
  ["moon-phase-08-first-quarter.webp", "上弦月", "月龄 09", "右半"],
  ["moon-phase-09-waxing-gibbous-01.webp", "盈凸月 01", "月龄 10", "右侧为主"],
  ["moon-phase-10-waxing-gibbous-02.webp", "盈凸月 02", "月龄 11", "右侧为主"],
  ["moon-phase-11-waxing-gibbous-03.webp", "盈凸月 03", "月龄 12", "右侧为主"],
  ["moon-phase-12-waxing-gibbous-04.webp", "盈凸月 04", "月龄 13", "右侧为主"],
  ["moon-phase-13-near-full-01.webp", "近满月 01", "月龄 14", "右侧为主"],
  ["moon-phase-14-near-full-02.webp", "近满月 02", "月龄 15", "右侧为主"],
  ["moon-phase-15-full-moon.webp", "满月", "月龄 16", "全亮"],
  ["moon-phase-16-waning-gibbous-01.webp", "亏凸月 01", "月龄 17", "左侧为主"],
  ["moon-phase-17-waning-gibbous-02.webp", "亏凸月 02", "月龄 18", "左侧为主"],
  ["moon-phase-18-waning-gibbous-03.webp", "亏凸月 03", "月龄 19", "左侧为主"],
  ["moon-phase-19-waning-gibbous-04.webp", "亏凸月 04", "月龄 20", "左侧为主"],
  ["moon-phase-20-waning-gibbous-05.webp", "亏凸月 05", "月龄 21", "左侧为主"],
  ["moon-phase-21-near-last-quarter.webp", "近下弦月", "月龄 22", "左侧"],
  ["moon-phase-22-before-last-quarter.webp", "下弦前", "月龄 23", "左侧"],
  ["moon-phase-23-last-quarter.webp", "下弦月", "月龄 24", "左半"],
  ["moon-phase-24-after-last-quarter.webp", "下弦后", "月龄 25", "左侧"],
  ["moon-phase-25-waning-crescent-01.webp", "亏蛾眉月 01", "月龄 26", "左侧"],
  ["moon-phase-26-waning-crescent-02.webp", "亏蛾眉月 02", "月龄 27", "左侧"],
  ["moon-phase-27-waning-crescent-03.webp", "亏蛾眉月 03", "月龄 28", "左侧"],
  ["moon-phase-28-old-crescent.webp", "残月", "月龄 29", "左侧"],
  ["moon-phase-29-dark-moon.webp", "晦月", "月龄 30", "极细左侧或近暗"]
] as const;

export const moonPhases: MoonPhase[] = phaseRows.map(([filename, nameZh, lunarDayLabel, expectedLitSide], index) => {
  const phaseAngleDeg = (index / 30) * 360;
  return {
    id: `phase-${String(index).padStart(2, "0")}`,
    index,
    nameZh,
    lunarDayLabel,
    assetPath: `/poster-lab/moon-phases/${filename}`,
    expectedLitSide,
    phaseAngleDeg,
    expectedIllumination: (1 - Math.cos((phaseAngleDeg / 180) * Math.PI)) / 2
  };
});

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export function moonPhaseFromDate(date: Date) {
  const elapsedDays = (date.getTime() - referenceNewMoonMs) / dayMs;
  const phaseAgeDays = positiveModulo(elapsedDays, synodicMonthDays);
  const phaseFraction = phaseAgeDays / synodicMonthDays;
  const phaseIndex = Math.round(phaseFraction * 30) % 30;
  const illumination = (1 - Math.cos(phaseFraction * Math.PI * 2)) / 2;

  return {
    phaseAgeDays,
    phaseFraction,
    phaseIndex,
    lunarDay: phaseIndex + 1,
    illumination,
    isWaxing: phaseFraction > 0 && phaseFraction < 0.5,
    phase: moonPhases[phaseIndex]
  };
}

export function phaseByIndex(index: number) {
  return moonPhases[((Math.round(index) % moonPhases.length) + moonPhases.length) % moonPhases.length];
}

export function resolvePhaseToken(token: string, date: Date) {
  const value = token.trim();
  if (!value || value.toLowerCase() === "auto" || value === "按日期") {
    const computed = moonPhaseFromDate(date).phase;
    return { phase: computed, phaseMode: "date" as const, warning: "" };
  }

  const phaseMatch = value.match(/^phase-(\d{1,2})$/i);
  const numericMatch = value.match(/^\d{1,2}$/);
  const index = phaseMatch ? Number(phaseMatch[1]) : numericMatch ? Number(value) : Number.NaN;
  if (Number.isInteger(index) && index >= 0 && index < moonPhases.length) {
    return { phase: phaseByIndex(index), phaseMode: "manual" as const, warning: "" };
  }

  const matched = moonPhases.find((phase) => phase.nameZh === value || phase.lunarDayLabel === value);
  if (matched) return { phase: matched, phaseMode: "manual" as const, warning: "" };

  const computed = moonPhaseFromDate(date).phase;
  return { phase: computed, phaseMode: "date" as const, warning: `月相“${value}”未识别，已按日期计算。` };
}
