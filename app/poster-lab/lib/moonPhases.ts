import { formatLunarDayName, lunarDateFromDate, moonPhaseNameFromLunarDay } from "./lunar";

export type MoonPhase = {
  id: string;
  index: number;
  nameZh: string;
  aliases: readonly string[];
  slotLabel: string;
  assetPath: string;
  expectedLitSide: string;
  expectedIllumination: number;
  phaseAngleDeg: number;
};

export type ComputedMoonPhase = {
  phaseAgeDays: number;
  phaseFraction: number;
  phaseIndex: number;
  lunarDay: number;
  lunarDayName: string;
  lunarMonthDayCount: number;
  illumination: number;
  isWaxing: boolean;
  elongationDeg: number;
  phase: MoonPhase;
};

const phaseRows = [
  ["moon-phase-00-new-moon.webp", "无明显亮面", []],
  ["moon-phase-01-waxing-crescent-01.webp", "右侧", []],
  ["moon-phase-02-waxing-crescent-02.webp", "右侧", []],
  ["moon-phase-03-waxing-crescent-03.webp", "右侧", []],
  ["moon-phase-04-waxing-crescent-04.webp", "右侧", []],
  ["moon-phase-05-waxing-moon-05.webp", "右侧", []],
  ["moon-phase-06-near-first-quarter.webp", "右侧", []],
  ["moon-phase-07-before-first-quarter.webp", "右侧", []],
  ["moon-phase-08-first-quarter.webp", "右半", []],
  ["moon-phase-09-waxing-gibbous-01.webp", "右侧为主", []],
  ["moon-phase-10-waxing-gibbous-02.webp", "右侧为主", []],
  ["moon-phase-11-waxing-gibbous-03.webp", "右侧为主", []],
  ["moon-phase-12-waxing-gibbous-04.webp", "右侧为主", []],
  ["moon-phase-13-near-full-01.webp", "右侧为主", []],
  ["moon-phase-14-near-full-02.webp", "右侧为主", []],
  ["moon-phase-15-full-moon.webp", "全亮", []],
  ["moon-phase-16-waning-gibbous-01.webp", "左侧为主", []],
  ["moon-phase-17-waning-gibbous-02.webp", "左侧为主", []],
  ["moon-phase-18-waning-gibbous-03.webp", "左侧为主", []],
  ["moon-phase-19-waning-gibbous-04.webp", "左侧为主", []],
  ["moon-phase-20-waning-gibbous-05.webp", "左侧为主", []],
  ["moon-phase-21-near-last-quarter.webp", "左侧", []],
  ["moon-phase-22-before-last-quarter.webp", "左侧", []],
  ["moon-phase-23-last-quarter.webp", "左半", []],
  ["moon-phase-24-after-last-quarter.webp", "左侧", []],
  ["moon-phase-25-waning-crescent-01.webp", "左侧", []],
  ["moon-phase-26-waning-crescent-02.webp", "左侧", []],
  ["moon-phase-27-waning-crescent-03.webp", "左侧", []],
  ["moon-phase-28-old-crescent.webp", "左侧", []],
  ["moon-phase-29-dark-moon.webp", "极细左侧或近暗", []]
] as const;

export const moonPhases: MoonPhase[] = phaseRows.map(([filename, expectedLitSide, aliases], index) => {
  const phaseAngleDeg = (index / 30) * 360;
  const lunarDay = index + 1;
  return {
    id: `phase-${String(lunarDay).padStart(2, "0")}`,
    index,
    nameZh: moonPhaseNameFromLunarDay(lunarDay),
    aliases,
    slotLabel: formatLunarDayName(lunarDay),
    assetPath: `/poster-lab/moon-phases/${filename}`,
    expectedLitSide,
    phaseAngleDeg,
    expectedIllumination: (1 - Math.cos((phaseAngleDeg / 180) * Math.PI)) / 2
  };
});

export function moonPhaseFromDate(date: Date): ComputedMoonPhase {
  const lunarDate = lunarDateFromDate(date);
  const phaseIndex = lunarDate.day - 1;
  const phase = moonPhases[phaseIndex];
  const phaseFraction = phaseIndex / moonPhases.length;

  return {
    phaseAgeDays: lunarDate.day,
    phaseFraction,
    phaseIndex,
    lunarDay: lunarDate.day,
    lunarDayName: lunarDate.dayName,
    lunarMonthDayCount: lunarDate.monthDayCount,
    illumination: phase.expectedIllumination,
    isWaxing: lunarDate.day >= 1 && lunarDate.day <= 15,
    elongationDeg: phase.phaseAngleDeg,
    phase
  };
}

export function phaseByIndex(index: number) {
  return moonPhases[((Math.round(index) % moonPhases.length) + moonPhases.length) % moonPhases.length];
}

export function phaseDisplayNumber(index: number) {
  return index + 1;
}

export function formatPhaseDisplayNumber(index: number) {
  return String(phaseDisplayNumber(index));
}

export function formatPhasePosition(index: number) {
  return `${formatLunarDayName(index + 1)}（图片档位 ${formatPhaseDisplayNumber(index)}）`;
}

export function resolvePhaseToken(token: string, date: Date) {
  const value = token.trim();
  if (!value || value.toLowerCase() === "auto" || value === "按日期") {
    const computed = moonPhaseFromDate(date).phase;
    return { phase: computed, phaseMode: "date" as const, warning: "" };
  }

  const phaseMatch = value.match(/^phase-(\d{1,2})$/i);
  const numericMatch = value.match(/^\d{1,2}$/);
  const numericValue = phaseMatch ? Number(phaseMatch[1]) : numericMatch ? Number(value) : Number.NaN;
  if (Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= moonPhases.length) {
    return { phase: phaseByIndex(numericValue - 1), phaseMode: "manual" as const, warning: "" };
  }

  const matched = moonPhases.find((phase) => phase.nameZh === value || phase.slotLabel === value || phase.aliases.includes(value));
  if (matched) return { phase: matched, phaseMode: "manual" as const, warning: "" };

  const computed = moonPhaseFromDate(date).phase;
  return { phase: computed, phaseMode: "date" as const, warning: `月相“${value}”未识别，已按日期计算。` };
}
