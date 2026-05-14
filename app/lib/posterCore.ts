import { filenameDate } from "./time";

export const ratioSizes = {
  "1:1": [1080, 1080],
  "4:5": [1080, 1350],
  "9:16": [1080, 1920],
  "16:9": [1920, 1080]
} as const;

export type RatioId = keyof typeof ratioSizes | "custom";

export type PosterSizingConfig = {
  ratio: RatioId;
  width: number;
  height: number;
};

export function outputSize(config: PosterSizingConfig) {
  if (config.ratio === "custom") {
    return {
      width: clampSize(config.width),
      height: clampSize(config.height)
    };
  }

  const [width, height] = ratioSizes[config.ratio];
  return { width, height };
}

export function clampSize(value: number) {
  return Math.max(512, Math.min(4096, Math.round(value || 1080)));
}

export function posterFontFamily(font: string) {
  return font.includes(",") || font.includes(" ") ? font : `${font}, sans-serif`;
}

export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const source = text.replace(/\s+/g, " ").trim();
  if (!source) return [];

  const words = /[\u3400-\u9fff]/.test(source) ? Array.from(source) : source.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const next = /[\u3400-\u9fff]/.test(source) ? `${line}${word}` : line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines;
}

export function downloadBlob(blob: Blob, date: Date, suffix: string, prefix = "poster-lab") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${prefix}-${filenameDate(date)}-${suffix}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}
