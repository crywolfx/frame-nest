import { Lunar, LunarMonth } from "lunar-javascript";
import { beijingParts } from "../../lib/time";

export const standardMoonPhaseNames = ["新月", "蛾眉月", "上弦月", "盈凸月", "满月", "亏凸月", "下弦月", "残月"] as const;

export type StandardMoonPhaseName = (typeof standardMoonPhaseNames)[number];

export type ChineseLunarDate = {
  relatedYear: number;
  yearName: string;
  month: number;
  monthName: string;
  day: number;
  dayName: string;
  monthDayCount: number;
  label: string;
};

const lunarDayNames = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十"
] as const;

export function lunarDateFromDate(date: Date): ChineseLunarDate {
  const parts = beijingParts(date);
  // Lunar.fromDate reads Date local fields. This Date is deliberately built so
  // those local fields equal the Beijing calendar date, independent of the
  // user's machine timezone or the UTC instant stored in MoonPosterConfig.date.
  const beijingLocalDate = new Date(parts.year, parts.month - 1, parts.date, 12, 0, 0);
  const lunar = Lunar.fromDate(beijingLocalDate);
  const relatedYear = lunar.getYear();
  const yearName = lunar.getYearInGanZhi();
  const month = lunar.getMonth();
  const monthName = `${lunar.getMonthInChinese()}月`;
  const day = lunar.getDay();
  const dayName = formatLunarDayName(day);
  const monthDayCount = lunarMonthDayCount(relatedYear, month);

  return {
    relatedYear,
    yearName,
    month,
    monthName,
    day,
    dayName,
    monthDayCount,
    label: `农历 ${monthName}${dayName}`
  };
}

export function formatLunarDate(date: Date) {
  return lunarDateFromDate(date).label;
}

export function formatLunarDayName(day: number) {
  return lunarDayNames[day - 1] ?? `农历第 ${day} 日`;
}

export function lunarMonthDayCount(year: number, month: number) {
  return LunarMonth.fromYm(year, month).getDayCount();
}

export function lunarMonthDayCountFromDate(date: Date) {
  return lunarDateFromDate(date).monthDayCount;
}

export function moonPhaseNameFromLunarDay(day: number): StandardMoonPhaseName {
  if (day === 1) return "新月";
  if (day >= 2 && day <= 6) return "蛾眉月";
  if (day >= 7 && day <= 8) return "上弦月";
  if (day >= 9 && day <= 14) return "盈凸月";
  if (day >= 15 && day <= 16) return "满月";
  if (day >= 17 && day <= 21) return "亏凸月";
  if (day >= 22 && day <= 23) return "下弦月";
  if (day === 30) return "新月";
  return "残月";
}

export function moonPhaseNameFromDate(date: Date) {
  return moonPhaseNameFromLunarDay(lunarDateFromDate(date).day);
}
