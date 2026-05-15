"use client";

import { motion } from "motion/react";
import {
  AlignCenter,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  LayoutGrid,
  Moon,
  Palette,
  RefreshCw,
  SlidersHorizontal,
  Type,
  X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { outputSize, ratioSizes, type RatioId } from "../lib/posterCore";
import { formatBeijingDate, formatBeijingDateTimeLabel, parseBeijingDateAtEvening, parseDatetimeLocal, toDatetimeLocal } from "../lib/time";
import { BatchPanel } from "./components/BatchPanel";
import { MoonPhaseSelector } from "./components/MoonPhaseSelector";
import { PanelTitle } from "./components/PanelTitle";
import { PosterPreview } from "./components/PosterPreview";
import { alignments, fonts } from "./lib/fonts";
import { parseBatchRows } from "./lib/batch";
import { formatMoonAgeLabel, formatPhaseDisplayNumber, moonPhaseFromDate, phaseByIndex } from "./lib/moonPhases";
import { exportMoonPoster, metadataStatus, renderMoonPosterPreview, resolvedPhaseIndex } from "./lib/renderMoonPoster";
import type { BatchRow, InfoModuleId, MoonPosterConfig, MoonPosterLayout } from "./lib/types";
import styles from "./poster-lab.module.css";

const layoutPresets: { id: MoonPosterLayout; label: string; x: number; y: number; align: CanvasTextAlign; size: number }[] = [
  { id: "lowerLeft", label: "左下", x: 0.1, y: 0.78, align: "left", size: 72 },
  { id: "center", label: "居中", x: 0.5, y: 0.52, align: "center", size: 82 },
  { id: "upperRight", label: "右上", x: 0.9, y: 0.18, align: "right", size: 54 },
  { id: "caption", label: "底部说明", x: 0.08, y: 0.88, align: "left", size: 42 }
];

const defaultBatch = `2026-05-15 | auto | 月相观测记录
2026-05-16 | phase-09 | 上弦月记录
2026-05-17 | 满月 | 满月记录`;

const infoModules: { id: InfoModuleId; label: string }[] = [
  { id: "phaseName", label: "显示月相名称" },
  { id: "lunarAge", label: "显示月龄" },
  { id: "date", label: "显示日期" },
  { id: "phaseIndex", label: "显示相位编号" },
  { id: "illumination", label: "显示光照比例" }
];

function defaultConfig(initialIso: string): MoonPosterConfig {
  const initialBeijingDate = formatBeijingDate(initialIso);
  const date = parseBeijingDateAtEvening(initialBeijingDate) ?? new Date(initialIso);
  const phase = moonPhaseFromDate(date).phase;
  return {
    templateId: "moonPhase",
    date,
    phaseMode: "date",
    phaseIndex: phase.index,
    text: "月相观测记录",
    font: fonts[0].value,
    color: "#fff6dc",
    size: 72,
    x: 0.1,
    y: 0.78,
    align: "left",
    layout: "lowerLeft",
    ratio: "4:5",
    width: 1080,
    height: 1350,
    infoModules: {
      phaseName: true,
      lunarAge: true,
      date: true,
      phaseIndex: true,
      illumination: false
    },
    infoGap: 1.42,
    backgroundStyle: "observatory",
    moonScale: 0.74,
    moonY: 0.42
  };
}

export default function PosterLabApp({ initialIso }: { initialIso: string }) {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const configRef = useRef<MoonPosterConfig | null>(null);
  const [config, setConfig] = useState(() => defaultConfig(initialIso));
  const [previewStatus, setPreviewStatus] = useState("正在准备预览。");
  const [exporting, setExporting] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [batchText, setBatchText] = useState(defaultBatch);
  const [batchRows, setBatchRows] = useState<BatchRow[]>([]);
  const [batchStatus, setBatchStatus] = useState("等待批量任务。");
  const [batchRunning, setBatchRunning] = useState(false);
  const computedPhase = useMemo(() => moonPhaseFromDate(config.date), [config.date]);
  const activePhase = phaseByIndex(resolvedPhaseIndex(config));
  const size = outputSize(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const refreshPreview = useCallback(async () => {
    const target = previewCanvasRef.current;
    const current = configRef.current;
    if (!target || !current) return;

    try {
      await renderMoonPosterPreview(target, current);
      setPreviewStatus("预览已更新。");
    } catch (error) {
      setPreviewStatus(error instanceof Error ? error.message : "预览生成失败。");
    }
  }, []);

  useEffect(() => {
    setPreviewStatus("正在更新预览。");
    const timer = window.setTimeout(() => {
      void refreshPreview();
    }, 280);
    return () => window.clearTimeout(timer);
  }, [config, refreshPreview]);

  const copyPreviewToZoom = useCallback(() => {
    const source = previewCanvasRef.current;
    const target = zoomCanvasRef.current;
    if (!source || !target || !source.width || !source.height) return;
    target.width = source.width;
    target.height = source.height;
    const ctx = target.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, target.width, target.height);
    ctx.drawImage(source, 0, 0);
  }, []);

  useEffect(() => {
    if (!zoomOpen) return;
    copyPreviewToZoom();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copyPreviewToZoom, zoomOpen]);

  function updateConfig(patch: Partial<MoonPosterConfig>) {
    setConfig((current) => ({ ...current, ...patch }));
  }

  function updateInfoModule(id: InfoModuleId, value: boolean) {
    setConfig((current) => ({
      ...current,
      infoModules: {
        ...current.infoModules,
        [id]: value
      }
    }));
  }

  function handleDateInputChange(value: string) {
    const parsed = parseDatetimeLocal(value);
    if (!parsed) return;
    updateConfig({ date: parsed, phaseMode: "date" });
  }

  async function handleExport() {
    try {
      setExporting(true);
      setPreviewStatus("正在导出 PNG。");
      await exportMoonPoster(config);
      setPreviewStatus(`已导出 ${size.width} x ${size.height} PNG。`);
    } catch (error) {
      setPreviewStatus(error instanceof Error ? error.message : "导出失败。");
    } finally {
      setExporting(false);
    }
  }

  async function handleBatchGenerate() {
    const parsed = parseBatchRows(batchText);
    setBatchRows(parsed.rows);
    if (!parsed.rows.length) {
      setBatchStatus(`没有有效任务。${parsed.warnings.join(" ")}`);
      return;
    }

    setBatchRunning(true);
    setBatchStatus(`准备生成 ${parsed.rows.length} 张。${parsed.warnings.join(" ")}`);

    for (const [index, row] of parsed.rows.entries()) {
      setBatchRows((rows) => rows.map((item) => item.id === row.id ? { ...item, status: "生成中" } : item));
      const rowConfig: MoonPosterConfig = {
        ...config,
        date: row.date,
        phaseMode: row.phaseMode,
        phaseIndex: row.phaseIndex,
        text: row.text
      };

      try {
        setBatchStatus(`批量 ${index + 1}/${parsed.rows.length}：${row.phaseLabel}`);
        await exportMoonPoster(rowConfig, `batch-${index + 1}-phase-${formatPhaseDisplayNumber(row.phaseIndex)}`);
        setBatchRows((rows) => rows.map((item) => item.id === row.id ? { ...item, status: "已完成" } : item));
      } catch (error) {
        setBatchRows((rows) => rows.map((item) => item.id === row.id ? { ...item, status: "失败", message: error instanceof Error ? error.message : "生成失败" } : item));
      }
      await wait(180);
    }

    setBatchRunning(false);
    setBatchStatus(`批量完成：${parsed.rows.length} 张。${parsed.warnings.join(" ")}`);
  }

  return (
    <main className={styles.shell} id="main">
      <div className={styles.backdrop} aria-hidden="true" />

      <motion.nav className={styles.nav} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
        <Link className={styles.brand} href="/">海报实验室</Link>
        <div className={styles.navLinks}>
          <Link href="/cosmic-moment">宇宙此刻</Link>
          <span>月相模板</span>
          <span>{activePhase.nameZh}</span>
        </div>
      </motion.nav>

      <div className={styles.workbench}>
        <motion.aside className={styles.leftPanel} initial={{ x: -24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.48, delay: 0.04 }}>
          <PanelTitle icon={<Moon size={16} />} title="模板" />
          <div className={styles.templateButton}>
            <ImageIcon size={18} />
            <div>
              <strong>月相</strong>
              <span>30 个相位档位</span>
            </div>
            <CheckCircle2 size={16} />
          </div>

          <PanelTitle icon={<CalendarDays size={16} />} title="日期与相位" />
          <label className={styles.field}>
            <span>北京时间日期时间</span>
            <input type="datetime-local" step={60} value={toDatetimeLocal(config.date)} onChange={(event) => handleDateInputChange(event.target.value)} />
          </label>
          <div className={styles.segmented}>
            <button className={config.phaseMode === "date" ? styles.segmentActive : styles.segment} type="button" onClick={() => updateConfig({ phaseMode: "date" })}>
              按日期计算
            </button>
            <button className={config.phaseMode === "manual" ? styles.segmentActive : styles.segment} type="button" onClick={() => updateConfig({ phaseMode: "manual", phaseIndex: activePhase.index })}>
              手动指定
            </button>
          </div>
          <p className={styles.readout}>
            {formatBeijingDateTimeLabel(config.date)} · 默认按当天晚上 20:00 观测，手动修改时分后按输入的北京时间 · 太阳/月亮几何相位估算 · 日期相位 {computedPhase.phase.nameZh} · {formatMoonAgeLabel(computedPhase.phaseAgeDays)} · 光照 {Math.round(computedPhase.illumination * 100)}%
          </p>
          <MoonPhaseSelector
            selectedIndex={activePhase.index}
            computedIndex={computedPhase.phaseIndex}
            onSelect={(phaseIndex) => updateConfig({ phaseMode: "manual", phaseIndex })}
          />
        </motion.aside>

        <motion.section className={styles.stage} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.08 }}>
          <div className={styles.stageHeader}>
            <div>
              <p>Poster Lab / Moon Phase</p>
              <h1>月相海报生成器</h1>
            </div>
            <span>{metadataStatus(config)}</span>
          </div>
          <PosterPreview
            canvasRef={previewCanvasRef}
            config={config}
            status={previewStatus}
            exporting={exporting}
            onRefresh={() => void refreshPreview()}
            onExport={() => void handleExport()}
            onZoom={() => setZoomOpen(true)}
          />
          <div className={styles.mobileActionBar}>
            <button className={styles.primaryButton} type="button" onClick={() => void handleExport()} disabled={exporting}>
              导出 PNG
            </button>
            <button className={styles.secondaryButton} type="button" onClick={() => void handleBatchGenerate()} disabled={batchRunning}>
              批量生成
            </button>
          </div>
        </motion.section>

        <motion.aside className={styles.rightDock} initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.48, delay: 0.1 }}>
          <section className={styles.rightPanel} aria-label="海报编辑器">
            <PanelTitle icon={<Type size={16} />} title="文字" />
            <textarea className={styles.textarea} value={config.text} onChange={(event) => updateConfig({ text: event.target.value })} aria-label="海报文字" />

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>字体</span>
                <select value={config.font} onChange={(event) => updateConfig({ font: event.target.value })}>
                  {fonts.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                </select>
              </label>
              <label className={styles.field}>
                <span>颜色</span>
                <input type="color" value={config.color} onChange={(event) => updateConfig({ color: event.target.value })} />
              </label>
            </div>

            <PanelTitle icon={<SlidersHorizontal size={16} />} title="排版" />
            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>字号 {config.size}</span>
                <input type="range" min={24} max={160} value={config.size} onChange={(event) => updateConfig({ size: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span>比例</span>
                <select
                  value={config.ratio}
                  onChange={(event) => {
                    const ratio = event.target.value as RatioId;
                    const [width, height] = ratio === "custom" ? [config.width, config.height] : ratioSizes[ratio];
                    updateConfig({ ratio, width, height });
                  }}
                >
                  <option value="1:1">1:1</option>
                  <option value="4:5">4:5</option>
                  <option value="9:16">9:16</option>
                  <option value="16:9">16:9</option>
                  <option value="custom">自定义</option>
                </select>
              </label>
            </div>
            {config.ratio === "custom" && (
              <div className={styles.twoCol}>
                <label className={styles.field}>
                  <span>宽度</span>
                  <input type="number" value={config.width} onChange={(event) => updateConfig({ width: Number(event.target.value) })} />
                </label>
                <label className={styles.field}>
                  <span>高度</span>
                  <input type="number" value={config.height} onChange={(event) => updateConfig({ height: Number(event.target.value) })} />
                </label>
              </div>
            )}

            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>横向位置 {Math.round(config.x * 100)}%</span>
                <input type="range" min={0.05} max={0.95} step={0.01} value={config.x} onChange={(event) => updateConfig({ x: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span>纵向位置 {Math.round(config.y * 100)}%</span>
                <input type="range" min={0.08} max={0.92} step={0.01} value={config.y} onChange={(event) => updateConfig({ y: Number(event.target.value) })} />
              </label>
            </div>

            <div className={styles.chipGrid} aria-label="版式预设">
              {layoutPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={config.layout === preset.id ? styles.selectedChip : styles.chip}
                  type="button"
                  onClick={() => updateConfig({ layout: preset.id, x: preset.x, y: preset.y, align: preset.align, size: preset.size })}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className={styles.chipGrid} aria-label="文字对齐">
              {alignments.map((alignment) => (
                <button key={alignment.id} className={config.align === alignment.id ? styles.selectedChip : styles.chip} type="button" onClick={() => updateConfig({ align: alignment.id })}>
                  <AlignCenter size={14} />
                  {alignment.label}
                </button>
              ))}
            </div>

            <PanelTitle icon={<Palette size={16} />} title="画布" />
            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>月面大小 {Math.round(config.moonScale * 100)}%</span>
                <input type="range" min={0.46} max={0.96} step={0.01} value={config.moonScale} onChange={(event) => updateConfig({ moonScale: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span>月面位置 {Math.round(config.moonY * 100)}%</span>
                <input type="range" min={0.25} max={0.7} step={0.01} value={config.moonY} onChange={(event) => updateConfig({ moonY: Number(event.target.value) })} />
              </label>
            </div>
            <label className={styles.field}>
              <span>背景</span>
              <select value={config.backgroundStyle} onChange={(event) => updateConfig({ backgroundStyle: event.target.value as MoonPosterConfig["backgroundStyle"] })}>
                <option value="observatory">观测台</option>
                <option value="instrument">仪器屏</option>
                <option value="deepBlack">深空黑</option>
              </select>
            </label>
            <PanelTitle icon={<LayoutGrid size={16} />} title="信息标注" />
            <label className={styles.field}>
              <span>标注距离 {config.infoGap.toFixed(2)} 行</span>
              <input type="range" min={0.7} max={3} step={0.05} value={config.infoGap} onChange={(event) => updateConfig({ infoGap: Number(event.target.value) })} />
            </label>
            <div className={styles.toggleGrid}>
              {infoModules.map((module) => (
                <label className={styles.toggle} key={module.id}>
                  <input type="checkbox" checked={config.infoModules[module.id]} onChange={(event) => updateInfoModule(module.id, event.target.checked)} />
                  {module.label}
                </label>
              ))}
            </div>
          </section>

          <BatchPanel value={batchText} rows={batchRows} status={batchStatus} running={batchRunning} onChange={setBatchText} onGenerate={() => void handleBatchGenerate()} />
        </motion.aside>
      </div>

      {zoomOpen && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="放大预览">
          <button className={styles.lightboxClose} type="button" onClick={() => setZoomOpen(false)} aria-label="关闭放大预览">
            <X size={18} />
            关闭
          </button>
          <div className={styles.lightboxCanvasWrap} style={{ aspectRatio: `${size.width} / ${size.height}` }}>
            <canvas ref={zoomCanvasRef} aria-label="放大的海报预览" />
          </div>
        </div>
      )}
    </main>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
