declare module "lunar-javascript" {
  export const Lunar: {
    fromDate(date: Date): LunarDate;
    fromYmd(year: number, month: number, day: number): LunarDate;
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): LunarDate;
  };

  export const LunarMonth: {
    fromYm(year: number, month: number): LunarMonthDate;
  };

  export type LunarDate = {
    getYear(): number;
    getYearInGanZhi(): string;
    getMonth(): number;
    getMonthInChinese(): string;
    getDay(): number;
    getDayInChinese(): string;
  };

  export type LunarMonthDate = {
    getDayCount(): number;
  };
}
