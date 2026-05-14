import { filenameDate, formatBeijingDateTimeLabel } from "./time";
import type { PosterConfig } from "./types";

export const ratioSizes = {
  "1:1": [1080, 1080],
  "4:5": [1080, 1350],
  "9:16": [1080, 1920],
  "16:9": [1920, 1080]
} as const;

export function outputSize(config: PosterConfig) {
  if (config.ratio === "custom") {
    return {
      width: clampSize(config.width),
      height: clampSize(config.height)
    };
  }
  const [width, height] = ratioSizes[config.ratio];
  return { width, height };
}

function clampSize(value: number) {
  return Math.max(512, Math.min(4096, Math.round(value || 1080)));
}

function drawCover(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, width: number, height: number) {
  const scale = Math.max(width / source.width, height / source.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (source.width - sw) / 2;
  const sy = (source.height - sh) / 2;
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, width, height);
}

export function posterFontFamily(font: string) {
  return font.includes(",") || font.includes(" ") ? font : `${font}, sans-serif`;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const source = text.replace(/\s+/g, " ").trim();
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

export function drawPoster(ctx: CanvasRenderingContext2D, source: HTMLCanvasElement, config: PosterConfig, date: Date) {
  const { width, height } = outputSize(config);

  ctx.clearRect(0, 0, width, height);
  drawCover(ctx, source, width, height);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(0,0,0,0.18)");
  gradient.addColorStop(config.layout === "center" ? 0.48 : 0.68, "rgba(0,0,0,0.02)");
  gradient.addColorStop(1, "rgba(0,0,0,0.58)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const x = width * config.x;
  const y = height * config.y;
  const fontSize = Math.max(24, Math.min(260, (config.size / 1080) * width));
  const maxWidth = config.layout === "center" ? width * 0.78 : width * 0.56;
  const lineHeight = fontSize * 1.08;

  ctx.font = `700 ${fontSize}px ${posterFontFamily(config.font)}`;
  ctx.fillStyle = config.color;
  ctx.textAlign = config.align;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.62)";
  ctx.shadowBlur = fontSize * 0.16;
  ctx.shadowOffsetY = fontSize * 0.04;

  wrapLines(ctx, config.text, maxWidth).slice(0, 6).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight, maxWidth);
  });

  if (config.metadata) {
    ctx.shadowBlur = 12;
    ctx.font = `500 ${Math.max(18, width * 0.018)}px ${posterFontFamily(config.font)}`;
    ctx.fillStyle = "rgba(245,247,238,0.82)";
    ctx.fillText(formatBeijingDateTimeLabel(date), x, Math.min(height - 36, y + lineHeight * 1.7), maxWidth);
  }
}

export function renderPosterPreview(target: HTMLCanvasElement, source: HTMLCanvasElement, config: PosterConfig, date: Date) {
  const { width, height } = outputSize(config);
  target.width = width;
  target.height = height;

  const ctx = target.getContext("2d");
  if (!ctx) throw new Error("预览画布不可用。");

  drawPoster(ctx, source, config, date);
}

export async function composePoster(source: HTMLCanvasElement, config: PosterConfig, date: Date) {
  const { width, height } = outputSize(config);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("画布导出不可用。");

  drawPoster(ctx, source, config, date);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("海报导出失败。"))), "image/png", 0.94);
  });
}

export function downloadBlob(blob: Blob, date: Date, suffix = "single") {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `cosmic-moment-${filenameDate(date)}-${suffix}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}
