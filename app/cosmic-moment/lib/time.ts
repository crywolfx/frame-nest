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

export function toDatetimeLocal(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}`;
}

export function fromDatetimeLocal(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function filenameDate(date: Date) {
  return date.toISOString().replace(/[:.]/g, "-");
}
