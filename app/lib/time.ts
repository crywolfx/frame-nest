export const speeds = [
  { label: "1倍", value: 1, title: "真实时间" },
  { label: "60倍", value: 60, title: "每秒一分钟" },
  { label: "1时/秒", value: 3600, title: "每秒一小时" },
  { label: "1日/秒", value: 86400, title: "每秒一天" },
  { label: "1周/秒", value: 604800, title: "每秒一周" }
] as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function normalizeDate(value: Date | string | number) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function beijingParts(value: Date | string | number) {
  const date = normalizeDate(value);
  const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return {
    year: beijingTime.getUTCFullYear(),
    month: beijingTime.getUTCMonth() + 1,
    date: beijingTime.getUTCDate(),
    hours: beijingTime.getUTCHours(),
    minutes: beijingTime.getUTCMinutes(),
    seconds: beijingTime.getUTCSeconds()
  };
}

export function formatBeijingDate(value: Date | string | number) {
  const parts = beijingParts(value);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.date)}`;
}

export function formatBeijingDateTime(value: Date | string | number) {
  const parts = beijingParts(value);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.date)} ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}

export function formatBeijingDateTimeLabel(value: Date | string | number) {
  return `北京时间 ${formatBeijingDateTime(value)}`;
}

export function toDatetimeLocal(date: Date) {
  const parts = beijingParts(date);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.date)}T${pad(parts.hours)}:${pad(parts.minutes)}`;
}

export function utcInstantToBeijingPickerDate(date: Date) {
  const parts = beijingParts(date);
  return new Date(parts.year, parts.month - 1, parts.date, parts.hours, parts.minutes, parts.seconds);
}

export function beijingPickerDateToUtcInstant(date: Date) {
  const parsed = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function parseDatetimeLocal(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds = "00"] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hours) - 8, Number(minutes), Number(seconds)));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function parseBeijingDate(value: string, hour = 20, minute = 0, second = 0) {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  return parseDatetimeLocal(`${year}-${month}-${day}T${pad(hour)}:${pad(minute)}:${pad(second)}`);
}

export function parseBeijingDateAtEvening(value: string) {
  return parseBeijingDate(value, 20);
}

export function fromDatetimeLocal(value: string) {
  return parseDatetimeLocal(value) ?? new Date();
}

export function filenameDate(date: Date) {
  return formatBeijingDateTime(date).replace(/[: ]/g, "-");
}
