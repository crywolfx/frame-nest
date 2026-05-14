import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(repoRoot, ".asset-sources");
const sourcePath = path.join(sourceDir, "nasa-lroc-color-4k.tif");
const outputDir = path.join(repoRoot, "public/poster-lab/moon-phases");
const auditPath = path.join(repoRoot, "docs/assets/moon-phase-audit.md");

const nasaSource = {
  title: "NASA SVS CGI Moon Kit LROC color map",
  pageUrl: "https://svs.gsfc.nasa.gov/4720/",
  fileUrl: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_16bit_srgb_4k.tif",
  credit: "NASA's Scientific Visualization Studio; LRO/LROC color mosaic"
};

const size = 2048;
const radius = size * 0.455;
const center = (size - 1) / 2;

const phases = [
  ["moon-phase-00-new-moon.webp", "新月", "月龄 01", "无明显亮面"],
  ["moon-phase-01-waxing-crescent-01.webp", "细盈蛾眉月", "月龄 02", "右侧"],
  ["moon-phase-02-waxing-crescent-02.webp", "盈蛾眉月 02", "月龄 03", "右侧"],
  ["moon-phase-03-waxing-crescent-03.webp", "盈蛾眉月 03", "月龄 04", "右侧"],
  ["moon-phase-04-waxing-crescent-04.webp", "盈蛾眉月 04", "月龄 05", "右侧"],
  ["moon-phase-05-waxing-moon-05.webp", "盈月 05", "月龄 06", "右侧"],
  ["moon-phase-06-near-first-quarter.webp", "近上弦月", "月龄 07", "右侧"],
  ["moon-phase-07-before-first-quarter.webp", "上弦前", "月龄 08", "右侧"],
  ["moon-phase-08-first-quarter.webp", "上弦月", "月龄 09", "右半"],
  ["moon-phase-09-waxing-gibbous-01.webp", "盈凸月 01", "月龄 10", "右侧为主"],
  ["moon-phase-10-waxing-gibbous-02.webp", "盈凸月 02", "月龄 11", "右侧为主"],
  ["moon-phase-11-waxing-gibbous-03.webp", "盈凸月 03", "月龄 12", "右侧为主"],
  ["moon-phase-12-waxing-gibbous-04.webp", "盈凸月 04", "月龄 13", "右侧为主"],
  ["moon-phase-13-near-full-01.webp", "近满月 01", "月龄 14", "右侧为主"],
  ["moon-phase-14-near-full-02.webp", "近满月 02", "月龄 15", "右侧为主"],
  ["moon-phase-15-full-moon.webp", "满月", "月龄 16", "全亮"],
  ["moon-phase-16-waning-gibbous-01.webp", "亏凸月 01", "月龄 17", "左侧为主"],
  ["moon-phase-17-waning-gibbous-02.webp", "亏凸月 02", "月龄 18", "左侧为主"],
  ["moon-phase-18-waning-gibbous-03.webp", "亏凸月 03", "月龄 19", "左侧为主"],
  ["moon-phase-19-waning-gibbous-04.webp", "亏凸月 04", "月龄 20", "左侧为主"],
  ["moon-phase-20-waning-gibbous-05.webp", "亏凸月 05", "月龄 21", "左侧为主"],
  ["moon-phase-21-near-last-quarter.webp", "近下弦月", "月龄 22", "左侧"],
  ["moon-phase-22-before-last-quarter.webp", "下弦前", "月龄 23", "左侧"],
  ["moon-phase-23-last-quarter.webp", "下弦月", "月龄 24", "左半"],
  ["moon-phase-24-after-last-quarter.webp", "下弦后", "月龄 25", "左侧"],
  ["moon-phase-25-waning-crescent-01.webp", "亏蛾眉月 01", "月龄 26", "左侧"],
  ["moon-phase-26-waning-crescent-02.webp", "亏蛾眉月 02", "月龄 27", "左侧"],
  ["moon-phase-27-waning-crescent-03.webp", "亏蛾眉月 03", "月龄 28", "左侧"],
  ["moon-phase-28-old-crescent.webp", "残月", "月龄 29", "左侧"],
  ["moon-phase-29-dark-moon.webp", "晦月", "月龄 30", "极细左侧或近暗"]
].map(([filename, nameZh, lunarDayLabel, expectedLitSide], index) => {
  const phaseAngleDeg = (index / 30) * 360;
  const expectedIllumination = (1 - Math.cos((phaseAngleDeg / 180) * Math.PI)) / 2;
  return { index, filename, nameZh, lunarDayLabel, expectedLitSide, phaseAngleDeg, expectedIllumination };
});

async function downloadIfMissing() {
  await fs.mkdir(sourceDir, { recursive: true });
  try {
    await fs.access(sourcePath);
    return;
  } catch {
    // Continue and download.
  }

  await new Promise((resolve, reject) => {
    const file = createWriteStream(sourcePath);
    https.get(nasaSource.fileUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`NASA source download failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", reject);
  });
}

function sampleBilinear(source, width, height, channels, u, v) {
  const x = Math.max(0, Math.min(width - 1.001, u));
  const y = Math.max(0, Math.min(height - 1.001, v));
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;
  const out = [0, 0, 0];

  for (let channel = 0; channel < 3; channel += 1) {
    const c00 = source[(y0 * width + x0) * channels + channel];
    const c10 = source[(y0 * width + x1) * channels + channel];
    const c01 = source[(y1 * width + x0) * channels + channel];
    const c11 = source[(y1 * width + x1) * channels + channel];
    out[channel] = c00 * (1 - tx) * (1 - ty) + c10 * tx * (1 - ty) + c01 * (1 - tx) * ty + c11 * tx * ty;
  }

  return out;
}

async function renderPhase(sourceRaw, sourceMeta, phase) {
  const sourceWidth = sourceMeta.width;
  const sourceHeight = sourceMeta.height;
  const sourceChannels = sourceMeta.channels;
  const output = Buffer.alloc(size * size * 4);
  const angle = (phase.phaseAngleDeg / 180) * Math.PI;
  const sun = [Math.sin(angle), 0, -Math.cos(angle)];
  const baseAmbient = phase.index === 0 || phase.index === 29 ? 0.015 : 0.025;

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      const dx = (px - center) / radius;
      const dy = (center - py) / radius;
      const rr = dx * dx + dy * dy;
      const index = (py * size + px) * 4;

      if (rr > 1) {
        output[index + 3] = 0;
        continue;
      }

      const z = Math.sqrt(1 - rr);
      const longitude = Math.atan2(dx, z);
      const latitude = Math.asin(dy);
      const u = ((longitude / (Math.PI * 2)) + 0.5) * sourceWidth;
      const v = (0.5 - latitude / Math.PI) * sourceHeight;
      const [r, g, b] = sampleBilinear(sourceRaw, sourceWidth, sourceHeight, sourceChannels, u, v);
      const limb = Math.max(0, Math.min(1, z));
      const lambert = Math.max(0, dx * sun[0] + z * sun[2]);
      const terminator = Math.pow(lambert, 0.72);
      const earthshine = baseAmbient * (0.55 + 0.45 * limb);
      const shade = Math.min(1, earthshine + terminator * (0.92 + 0.08 * limb));
      const rim = Math.pow(1 - limb, 2.2) * 12;

      output[index] = Math.max(0, Math.min(255, r * shade + rim));
      output[index + 1] = Math.max(0, Math.min(255, g * shade + rim));
      output[index + 2] = Math.max(0, Math.min(255, b * shade + rim));
      output[index + 3] = 255;
    }
  }

  await sharp(output, { raw: { width: size, height: size, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 96, effort: 5 })
    .toFile(path.join(outputDir, phase.filename));
}

async function writeAudit() {
  await fs.mkdir(path.dirname(auditPath), { recursive: true });
  const rows = phases.map((phase) => {
    const illumination = `${Math.round(phase.expectedIllumination * 100)}%`;
    return `| ${String(phase.index).padStart(2, "0")} | ${phase.filename} | ${size}x${size} | ${phase.nameZh} | ${phase.expectedLitSide} | ${illumination} | generated; pending Hermes visual audit | |`;
  });

  const markdown = `# Moon Phase Asset Audit

Generated by \`scripts/generate-moon-phases.mjs\`.

## Source

- Source: ${nasaSource.title}
- Page: ${nasaSource.pageUrl}
- File: ${nasaSource.fileUrl}
- Credit: ${nasaSource.credit}
- Method: deterministic orthographic Moon rendering from the NASA LRO/LROC color map, with analytic phase lighting masks.
- Orientation: Northern Hemisphere convention; waxing phases are right-lit, waning phases are left-lit.
- Output: 30 built-in WebP files, ${size}x${size}, transparent outside the lunar disk.

## Mechanical Audit

- Count: 30 files expected.
- Dimensions: ${size}x${size} expected for every generated file.
- Status: generated mechanically; Hermes still needs one-by-one visual review before final acceptance.

| Index | Filename | Dimensions | Expected Phase | Expected Lit Side | Expected Illumination | Generated Status | Hermes Accepted |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;

  await fs.writeFile(auditPath, markdown);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await downloadIfMissing();

  const sourceImage = sharp(sourcePath).removeAlpha().toColourspace("srgb");
  const { data, info } = await sourceImage.raw().toBuffer({ resolveWithObject: true });

  for (const phase of phases) {
    await renderPhase(data, info, phase);
  }

  await writeAudit();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
