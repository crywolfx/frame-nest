import { formatBeijingDate, formatBeijingDateTimeLabel } from "../../lib/time";
import { downloadBlob, outputSize, posterFontFamily, wrapLines } from "../../lib/posterCore";
import { formatLunarDate, moonPhaseNameFromDate } from "./lunar";
import { formatPhaseDisplayNumber, formatPhasePosition, moonPhaseFromDate, phaseByIndex } from "./moonPhases";
import type { MoonPosterConfig } from "./types";

const imageCache = new Map<number, Promise<HTMLImageElement>>();

export function resolvedPhaseIndex(config: MoonPosterConfig) {
  return config.phaseMode === "date" ? moonPhaseFromDate(config.date).phaseIndex : config.phaseIndex;
}

async function waitForPosterFonts(config: MoonPosterConfig) {
  if (!("fonts" in document)) return;
  const family = posterFontFamily(config.font);
  await Promise.allSettled([
    document.fonts.load(`800 72px ${family}`, config.text || "月相观测记录"),
    document.fonts.load(`600 22px ${family}`, "月相：满月 · 农历 四月十五 · 北京时间 2026-05-17 · 相位 16/30")
  ]);
  await document.fonts.ready;
}

export function loadMoonPhaseImage(phaseIndex: number) {
  const phase = phaseByIndex(phaseIndex);
  const cached = imageCache.get(phase.index);
  if (cached) return cached;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`月相图片加载失败：${phase.id}`));
    image.src = phase.assetPath;
  });

  imageCache.set(phase.index, promise);
  return promise;
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, style: MoonPosterConfig["backgroundStyle"]) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, style === "deepBlack" ? "#010206" : "#04101a");
  gradient.addColorStop(0.48, style === "instrument" ? "#07120f" : "#07101c");
  gradient.addColorStop(1, "#010308");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = style === "deepBlack" ? 0.14 : 0.23;
  ctx.strokeStyle = "rgba(157, 232, 193, 0.2)";
  ctx.lineWidth = Math.max(1, width / 1600);
  const grid = Math.max(56, width / 18);
  for (let x = 0; x <= width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(245, 240, 220, 0.6)";
  for (let index = 0; index < 130; index += 1) {
    const x = (Math.sin(index * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(index * 78.233) * 21754.318) % 1;
    const px = Math.abs(x) * width;
    const py = Math.abs(y) * height;
    const size = 0.7 + (index % 5) * 0.22;
    ctx.globalAlpha = 0.12 + (index % 7) * 0.035;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawTechnicalOverlay(ctx: CanvasRenderingContext2D, width: number, height: number, moonX: number, moonY: number, moonSize: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(102, 181, 255, 0.18)";
  ctx.lineWidth = Math.max(1, width / 1800);
  ctx.setLineDash([width * 0.012, width * 0.01]);
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonSize * 0.54, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "rgba(255, 188, 92, 0.25)";
  ctx.beginPath();
  ctx.moveTo(moonX - moonSize * 0.72, moonY);
  ctx.lineTo(moonX - moonSize * 0.58, moonY);
  ctx.moveTo(moonX + moonSize * 0.58, moonY);
  ctx.lineTo(moonX + moonSize * 0.72, moonY);
  ctx.moveTo(moonX, moonY - moonSize * 0.72);
  ctx.lineTo(moonX, moonY - moonSize * 0.58);
  ctx.moveTo(moonX, moonY + moonSize * 0.58);
  ctx.lineTo(moonX, moonY + moonSize * 0.72);
  ctx.stroke();
  ctx.restore();
}

export function drawMoonPoster(ctx: CanvasRenderingContext2D, image: HTMLImageElement, config: MoonPosterConfig) {
  const { width, height } = outputSize(config);

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height, config.backgroundStyle);

  const shorter = Math.min(width, height);
  const moonSize = Math.min(width * 0.9, height * 0.74, shorter * config.moonScale);
  const moonX = width * 0.5;
  const moonY = height * config.moonY;

  ctx.save();
  ctx.shadowColor = "rgba(102, 181, 255, 0.32)";
  ctx.shadowBlur = moonSize * 0.12;
  ctx.drawImage(image, moonX - moonSize / 2, moonY - moonSize / 2, moonSize, moonSize);
  ctx.restore();
  drawTechnicalOverlay(ctx, width, height, moonX, moonY, moonSize);

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.48, shorter * 0.12, width * 0.5, height * 0.48, shorter * 0.74);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.46)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  const x = width * config.x;
  const y = height * config.y;
  const fontSize = Math.max(22, Math.min(260, (config.size / 1080) * width));
  const maxWidth = config.layout === "center" ? width * 0.78 : width * 0.58;
  const lineHeight = fontSize * 1.1;

  ctx.font = `800 ${fontSize}px ${posterFontFamily(config.font)}`;
  ctx.fillStyle = config.color;
  ctx.textAlign = config.align;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = fontSize * 0.16;
  ctx.shadowOffsetY = fontSize * 0.04;

  const textLines = wrapLines(ctx, config.text, maxWidth).slice(0, 5);
  textLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight, maxWidth);
  });

  const metadata = posterInfoLine(config);
  if (metadata) {
    ctx.shadowBlur = 10;
    ctx.font = `600 ${Math.max(18, width * 0.017)}px ${posterFontFamily(config.font)}`;
    ctx.fillStyle = "rgba(245,247,238,0.82)";
    const lastTextBaseline = y + Math.max(0, textLines.length - 1) * lineHeight;
    const metadataY = lastTextBaseline + lineHeight * config.infoGap;
    ctx.fillText(metadata, x, Math.min(height - 34, metadataY), Math.min(width * 0.82, maxWidth * 1.35));
  }
}

export async function renderMoonPosterPreview(target: HTMLCanvasElement, config: MoonPosterConfig) {
  const { width, height } = outputSize(config);
  const image = await loadMoonPhaseImage(resolvedPhaseIndex(config));
  await waitForPosterFonts(config);
  target.width = width;
  target.height = height;
  const ctx = target.getContext("2d");
  if (!ctx) throw new Error("预览画布不可用。");
  drawMoonPoster(ctx, image, config);
}

export async function composeMoonPoster(config: MoonPosterConfig) {
  const { width, height } = outputSize(config);
  const image = await loadMoonPhaseImage(resolvedPhaseIndex(config));
  await waitForPosterFonts(config);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("画布导出不可用。");
  drawMoonPoster(ctx, image, config);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("海报导出失败。"))), "image/png", 0.94);
  });
}

export async function exportMoonPoster(config: MoonPosterConfig, suffix = `phase-${formatPhaseDisplayNumber(resolvedPhaseIndex(config))}`) {
  const blob = await composeMoonPoster(config);
  downloadBlob(blob, config.date, suffix, "poster-lab");
}

export function metadataStatus(config: MoonPosterConfig) {
  return `${formatBeijingDateTimeLabel(config.date)} · ${formatLunarDate(config.date)} · ${displayPhaseName(config)}`;
}

export function posterInfoLine(config: MoonPosterConfig) {
  const phaseInfo = moonPhaseFromDate(config.date);
  const modules = config.infoModules;
  const parts: string[] = [];

  if (modules.phaseName) parts.push(`月相：${displayPhaseName(config)}`);
  if (modules.lunarDate) parts.push(formatLunarDate(config.date));
  if (modules.date) parts.push(`北京时间 ${formatBeijingDate(config.date)}`);
  if (modules.phaseIndex) parts.push(`相位 ${formatPhasePosition(resolvedPhaseIndex(config))}`);
  if (modules.illumination) {
    parts.push(`光照 ${Math.round(phaseInfo.illumination * 100)}%`);
  }

  return parts.join(" · ");
}

export function displayPhaseName(config: MoonPosterConfig) {
  if (config.phaseMode === "date") return moonPhaseNameFromDate(config.date);
  return phaseByIndex(resolvedPhaseIndex(config)).nameZh;
}
