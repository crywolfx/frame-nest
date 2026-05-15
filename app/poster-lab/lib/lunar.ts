import { Lunar } from "lunar-javascript";
import { beijingParts } from "../../lib/time";

export const standardMoonPhaseNames = ["新月", "蛾眉月", "上弦月", "盈凸月", "满月", "亏凸月", "下弦月", "残月"] as const;

export type StandardMoonPhaseName = (typeof standardMoonPhaseNames)[number];

export type ChineseLunarDate = {
  relatedYear: number;
  yearName: string;
  monthName: string;
  day: number;
  dayName: string;
  label: string;
};

export function lunarDateFromDate(date: Date): ChineseLunarDate {
  const parts = beijingParts(date);
  // Lunar.fromDate reads Date local fields. This Date is deliberately built so
  // those local fields equal the Beijing calendar date, independent of the
  // user's machine timezone or the UTC instant stored in MoonPosterConfig.date.
  const beijingLocalDate = new Date(parts.year, parts.month - 1, parts.date, 12, 0, 0);
  const lunar = Lunar.fromDate(beijingLocalDate);
  const relatedYear = lunar.getYear();
  const yearName = lunar.getYearInGanZhi();
  const monthName = `${lunar.getMonthInChinese()}月`;
  const day = lunar.getDay();
  const dayName = lunar.getDayInChinese();

  return {
    relatedYear,
    yearName,
    monthName,
    day,
    dayName,
    label: `农历 ${monthName}${dayName}`
  };
}

export function formatLunarDate(date: Date) {
  return lunarDateFromDate(date).label;
}

export function moonPhaseNameFromLunarDay(day: number): StandardMoonPhaseName {
  if (day === 1) return "新月";
  if (day >= 2 && day <= 6) return "蛾眉月";
  if (day >= 7 && day <= 8) return "上弦月";
  if (day >= 9 && day <= 14) return "盈凸月";
  if (day >= 15 && day <= 16) return "满月";
  if (day >= 17 && day <= 21) return "亏凸月";
  if (day >= 22 && day <= 23) return "下弦月";
  return "残月";
}

export function moonPhaseNameFromDate(date: Date) {
  return moonPhaseNameFromLunarDay(lunarDateFromDate(date).day);
}
