export const speeds = [
  { label: "1x", value: 1, title: "Real time" },
  { label: "60x", value: 60, title: "Minute / second" },
  { label: "1h/s", value: 3600, title: "Hour / second" },
  { label: "1d/s", value: 86400, title: "Day / second" },
  { label: "1w/s", value: 604800, title: "Week / second" }
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
