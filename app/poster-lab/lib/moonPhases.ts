export const synodicMonthDays = 29.530588853;
const unixEpochJulianDay = 2440587.5;
const dayMs = 86_400_000;

export type MoonPhase = {
  id: string;
  index: number;
  nameZh: string;
  aliases: readonly string[];
  lunarDayLabel: string;
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
  illumination: number;
  isWaxing: boolean;
  elongationDeg: number;
  phase: MoonPhase;
};

const phaseRows = [
  ["moon-phase-00-new-moon.webp", "新月", "月龄 01", "无明显亮面", ["新月"]],
  ["moon-phase-01-waxing-crescent-01.webp", "蛾眉月", "月龄 02", "右侧", ["细盈蛾眉月"]],
  ["moon-phase-02-waxing-crescent-02.webp", "蛾眉月", "月龄 03", "右侧", ["盈蛾眉月 02"]],
  ["moon-phase-03-waxing-crescent-03.webp", "蛾眉月", "月龄 04", "右侧", ["盈蛾眉月 03"]],
  ["moon-phase-04-waxing-crescent-04.webp", "蛾眉月", "月龄 05", "右侧", ["盈蛾眉月 04"]],
  ["moon-phase-05-waxing-moon-05.webp", "蛾眉月", "月龄 06", "右侧", ["盈月 05"]],
  ["moon-phase-06-near-first-quarter.webp", "蛾眉月", "月龄 07", "右侧", ["近上弦月"]],
  ["moon-phase-07-before-first-quarter.webp", "蛾眉月", "月龄 08", "右侧", ["上弦前"]],
  ["moon-phase-08-first-quarter.webp", "上弦月", "月龄 09", "右半", ["上弦月"]],
  ["moon-phase-09-waxing-gibbous-01.webp", "盈凸月", "月龄 10", "右侧为主", ["盈凸月 01"]],
  ["moon-phase-10-waxing-gibbous-02.webp", "盈凸月", "月龄 11", "右侧为主", ["盈凸月 02"]],
  ["moon-phase-11-waxing-gibbous-03.webp", "盈凸月", "月龄 12", "右侧为主", ["盈凸月 03"]],
  ["moon-phase-12-waxing-gibbous-04.webp", "盈凸月", "月龄 13", "右侧为主", ["盈凸月 04"]],
  ["moon-phase-13-near-full-01.webp", "盈凸月", "月龄 14", "右侧为主", ["近满月 01"]],
  ["moon-phase-14-near-full-02.webp", "盈凸月", "月龄 15", "右侧为主", ["近满月 02"]],
  ["moon-phase-15-full-moon.webp", "满月", "月龄 16", "全亮", ["满月"]],
  ["moon-phase-16-waning-gibbous-01.webp", "亏凸月", "月龄 17", "左侧为主", ["亏凸月 01"]],
  ["moon-phase-17-waning-gibbous-02.webp", "亏凸月", "月龄 18", "左侧为主", ["亏凸月 02"]],
  ["moon-phase-18-waning-gibbous-03.webp", "亏凸月", "月龄 19", "左侧为主", ["亏凸月 03"]],
  ["moon-phase-19-waning-gibbous-04.webp", "亏凸月", "月龄 20", "左侧为主", ["亏凸月 04"]],
  ["moon-phase-20-waning-gibbous-05.webp", "亏凸月", "月龄 21", "左侧为主", ["亏凸月 05"]],
  ["moon-phase-21-near-last-quarter.webp", "亏凸月", "月龄 22", "左侧", ["近下弦月"]],
  ["moon-phase-22-before-last-quarter.webp", "亏凸月", "月龄 23", "左侧", ["下弦前"]],
  ["moon-phase-23-last-quarter.webp", "下弦月", "月龄 24", "左半", ["下弦月"]],
  ["moon-phase-24-after-last-quarter.webp", "残月", "月龄 25", "左侧", ["下弦后"]],
  ["moon-phase-25-waning-crescent-01.webp", "残月", "月龄 26", "左侧", ["亏蛾眉月 01"]],
  ["moon-phase-26-waning-crescent-02.webp", "残月", "月龄 27", "左侧", ["亏蛾眉月 02"]],
  ["moon-phase-27-waning-crescent-03.webp", "残月", "月龄 28", "左侧", ["亏蛾眉月 03"]],
  ["moon-phase-28-old-crescent.webp", "残月", "月龄 29", "左侧", ["残月"]],
  ["moon-phase-29-dark-moon.webp", "残月", "月龄 30", "极细左侧或近暗", ["晦月"]]
] as const;

export const moonPhases: MoonPhase[] = phaseRows.map(([filename, nameZh, lunarDayLabel, expectedLitSide, aliases], index) => {
  const phaseAngleDeg = (index / 30) * 360;
  return {
    id: `phase-${String(index).padStart(2, "0")}`,
    index,
    nameZh,
    aliases,
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

function degToRad(value: number) {
  return (value / 180) * Math.PI;
}

function julianDay(date: Date) {
  return date.getTime() / dayMs + unixEpochJulianDay;
}

function sunEclipticLongitude(jd: number) {
  const t = (jd - 2451545.0) / 36525;
  const meanLongitude = positiveModulo(280.46646 + 36000.76983 * t + 0.0003032 * t * t, 360);
  const meanAnomaly = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  const equationOfCenter =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(degToRad(meanAnomaly)) +
    (0.019993 - 0.000101 * t) * Math.sin(degToRad(2 * meanAnomaly)) +
    0.000289 * Math.sin(degToRad(3 * meanAnomaly));

  return positiveModulo(meanLongitude + equationOfCenter, 360);
}

function moonEclipticLongitude(jd: number) {
  const days = jd - 2451545.0;
  const meanLongitude = positiveModulo(218.3164477 + 13.17639648 * days, 360);
  const moonMeanAnomaly = positiveModulo(134.9633964 + 13.06499295 * days, 360);
  const sunMeanAnomaly = positiveModulo(357.5291092 + 0.98560028 * days, 360);
  const meanElongation = positiveModulo(297.8501921 + 12.19074912 * days, 360);
  const argumentOfLatitude = positiveModulo(93.2720950 + 13.22935024 * days, 360);

  const longitude =
    meanLongitude +
    6.288774 * Math.sin(degToRad(moonMeanAnomaly)) +
    1.274027 * Math.sin(degToRad(2 * meanElongation - moonMeanAnomaly)) +
    0.658314 * Math.sin(degToRad(2 * meanElongation)) +
    0.213618 * Math.sin(degToRad(2 * moonMeanAnomaly)) -
    0.185116 * Math.sin(degToRad(sunMeanAnomaly)) -
    0.114332 * Math.sin(degToRad(2 * argumentOfLatitude)) +
    0.058793 * Math.sin(degToRad(2 * meanElongation - 2 * moonMeanAnomaly)) +
    0.057066 * Math.sin(degToRad(2 * meanElongation - sunMeanAnomaly - moonMeanAnomaly)) +
    0.053322 * Math.sin(degToRad(2 * meanElongation + moonMeanAnomaly)) +
    0.045758 * Math.sin(degToRad(2 * meanElongation - sunMeanAnomaly)) -
    0.040923 * Math.sin(degToRad(sunMeanAnomaly - moonMeanAnomaly)) -
    0.034720 * Math.sin(degToRad(meanElongation)) -
    0.030383 * Math.sin(degToRad(sunMeanAnomaly + moonMeanAnomaly));

  return positiveModulo(longitude, 360);
}

export function moonPhaseFromDate(date: Date): ComputedMoonPhase {
  const jd = julianDay(date);
  const elongationDeg = positiveModulo(moonEclipticLongitude(jd) - sunEclipticLongitude(jd), 360);
  const phaseFraction = elongationDeg / 360;
  const phaseAgeDays = phaseFraction * synodicMonthDays;
  const phaseIndex = Math.round(phaseFraction * moonPhases.length) % moonPhases.length;
  const illumination = (1 - Math.cos(degToRad(elongationDeg))) / 2;

  return {
    phaseAgeDays,
    phaseFraction,
    phaseIndex,
    lunarDay: Math.floor(phaseAgeDays) + 1,
    illumination,
    isWaxing: elongationDeg > 0 && elongationDeg < 180,
    elongationDeg,
    phase: moonPhases[phaseIndex]
  };
}

export function formatMoonAgeLabel(phaseAgeDays: number) {
  return `月龄约 ${phaseAgeDays.toFixed(1)} 天`;
}

export function phaseByIndex(index: number) {
  return moonPhases[((Math.round(index) % moonPhases.length) + moonPhases.length) % moonPhases.length];
}

export function phaseDisplayNumber(index: number) {
  return index + 1;
}

export function formatPhaseDisplayNumber(index: number) {
  return String(phaseDisplayNumber(index)).padStart(2, "0");
}

export function formatPhasePosition(index: number) {
  return `${formatPhaseDisplayNumber(index)}/${moonPhases.length}`;
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

  const matched = moonPhases.find((phase) => phase.nameZh === value || phase.lunarDayLabel === value || phase.aliases.includes(value));
  if (matched) return { phase: matched, phaseMode: "manual" as const, warning: "" };

  const computed = moonPhaseFromDate(date).phase;
  return { phase: computed, phaseMode: "date" as const, warning: `月相“${value}”未识别，已按日期计算。` };
}
