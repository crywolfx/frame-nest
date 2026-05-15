declare module "lunar-javascript" {
  export const Lunar: {
    fromDate(date: Date): LunarDate;
  };

  export type LunarDate = {
    getYear(): number;
    getYearInGanZhi(): string;
    getMonthInChinese(): string;
    getDay(): number;
    getDayInChinese(): string;
  };
}
