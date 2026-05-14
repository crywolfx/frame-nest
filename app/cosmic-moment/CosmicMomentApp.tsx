"use client";

import { motion } from "motion/react";
import {
  Camera,
  Clock3,
  Download,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Minimize2,
  Palette,
  PanelLeftClose,
  PanelRightClose,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  View,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UniverseCanvas, type UniverseHandle } from "./components/UniverseCanvas";
import styles from "./cosmic.module.css";
import { bodies } from "./lib/bodies";
import { celestialEvents } from "./lib/celestialEvents";
import { getSolarSystemState, moonPhaseName } from "./lib/orbits";
import { composePoster, downloadBlob, outputSize, ratioSizes, renderPosterPreview } from "./lib/poster";
import { formatBeijingDateTimeLabel, fromDatetimeLocal, parseDatetimeLocal, speeds, toDatetimeLocal } from "./lib/time";
import type { BatchRow, BodyId, CelestialEvent, PosterConfig, RatioId, ViewPresetId, VisualStyleId } from "./lib/types";

const views: { id: ViewPresetId; label: string }[] = [
  { id: "free", label: "自由" },
  { id: "earth", label: "近地" },
  { id: "moon", label: "近月" },
  { id: "sun", label: "近日" },
  { id: "earthToMoon", label: "地望月" },
  { id: "moonToEarth", label: "月望地" },
  { id: "overview", label: "总览" },
  { id: "top", label: "俯视" },
  { id: "cinematic", label: "运镜" }
];

const visualStyles: { id: VisualStyleId; label: string; note: string }[] = [
  { id: "nasa", label: "NASA 拟真", note: "使用本地真实行星贴图与柔和暗面补光" },
  { id: "cinema", label: "电影宇宙", note: "高反差光晕与暖色镜头感" },
  { id: "instrument", label: "暗夜仪器", note: "低饱和观测屏幕与细轨道线" },
  { id: "neon", label: "霓虹星图", note: "高亮边缘与星图式色彩" }
];

const fonts = [
  { value: '"Avenir Next", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif', label: "现代无衬线" },
  { value: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif', label: "苹方 / 微软雅黑" },
  { value: '"Songti SC", "SimSun", "Noto Serif SC", serif', label: "宋体书卷" },
  { value: '"Kaiti SC", "KaiTi", "STKaiti", serif', label: "楷体题字" },
  { value: '"Heiti SC", "Microsoft YaHei", "Noto Sans SC", sans-serif', label: "黑体海报" },
  { value: '"YuMincho", "Songti SC", "Noto Serif SC", serif', label: "明朝衬线" },
  { value: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Songti SC", serif', label: "古典衬线" },
  { value: 'Georgia, "Times New Roman", "Songti SC", serif', label: "报刊衬线" },
  { value: '"Helvetica Neue", Arial, "PingFang SC", sans-serif', label: "瑞士无衬线" },
  { value: '"DIN Alternate", "Arial Narrow", "PingFang SC", sans-serif', label: "窄体数字" },
  { value: '"Menlo", "SFMono-Regular", "Consolas", "Microsoft YaHei", monospace', label: "等宽观测" }
];

const alignments: { id: CanvasTextAlign; label: string }[] = [
  { id: "left", label: "左对齐" },
  { id: "center", label: "居中" },
  { id: "right", label: "右对齐" }
];
const layouts: { id: PosterConfig["layout"]; label: string; x: number; y: number; align: CanvasTextAlign; size: number }[] = [
  { id: "lowerLeft", label: "左下标题", x: 0.1, y: 0.78, align: "left", size: 72 },
  { id: "center", label: "居中主标题", x: 0.5, y: 0.5, align: "center", size: 86 },
  { id: "upperRight", label: "右上角注记", x: 0.9, y: 0.18, align: "right", size: 54 },
  { id: "caption", label: "安静说明", x: 0.08, y: 0.88, align: "left", size: 42 }
];

const defaultPoster: PosterConfig = {
  text: "在那一秒，天空替我们记住时间。",
  font: "Avenir Next",
  color: "#fff6dc",
  size: 72,
  x: 0.1,
  y: 0.78,
  align: "left",
  layout: "lowerLeft",
  ratio: "4:5",
  width: 1080,
  height: 1350,
  metadata: true
};

const defaultBatch = `2026-05-13 21:30:15 | 我们抬头的那个夜晚 | 地望月
2026-06-01 00:00:00 | 六月的天空 | 总览`;

export default function CosmicMomentApp({ initialIso }: { initialIso: string }) {
  const shellRef = useRef<HTMLElement | null>(null);
  const universeRef = useRef<UniverseHandle>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewStateRef = useRef<{ poster: PosterConfig; date: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date(initialIso));
  const [timeRevision, setTimeRevision] = useState(0);
  const [paused, setPaused] = useState(true);
  const [speed, setSpeed] = useState<number>(60);
  const [selectedBodyId, setSelectedBodyId] = useState<BodyId>("earth");
  const [selectedViewId, setSelectedViewId] = useState<ViewPresetId>("overview");
  const [visualStyleId, setVisualStyleId] = useState<VisualStyleId>("nasa");
  const [focusKey, setFocusKey] = useState(0);
  const [showEclipseAssist, setShowEclipseAssist] = useState(false);
  const [showPosterPreview, setShowPosterPreview] = useState(false);
  const [hasPosterPreview, setHasPosterPreview] = useState(false);
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);
  const [previewStatus, setPreviewStatus] = useState("尚未生成预览。");
  const [hiddenPanels, setHiddenPanels] = useState({ left: false, views: false, right: false });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [poster, setPoster] = useState<PosterConfig>(defaultPoster);
  const [batchText, setBatchText] = useState(defaultBatch);
  const [status, setStatus] = useState("已准备渲染。");
  const states = useMemo(() => getSolarSystemState(currentDate), [currentDate]);
  const selectedBody = bodies.find((body) => body.id === selectedBodyId);
  const size = outputSize(poster);
  const autoPreviewDateTime = paused ? currentDate.getTime() : 0;

  useEffect(() => {
    seekDate(new Date());
  }, []);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === shellRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  useEffect(() => {
    previewStateRef.current = { poster, date: currentDate };
  }, [currentDate, poster]);

  const handleCanvasDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  function seekDate(date: Date) {
    setCurrentDate(date);
    setTimeRevision((revision) => revision + 1);
  }

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

  const refreshPosterPreview = useCallback(async (options: { waitForCamera?: boolean; timeoutMs?: number } = {}) => {
    const target = previewCanvasRef.current;
    const previewState = previewStateRef.current;
    if (!target || !previewState) return;

    try {
      setPreviewStatus("正在生成预览...");
      const canvas = await universeRef.current?.captureFrame({ waitForCamera: options.waitForCamera ?? true, timeoutMs: options.timeoutMs ?? 2600 });
      if (!canvas) return;
      renderPosterPreview(target, canvas, previewState.poster, previewState.date);
      setHasPosterPreview(true);
      if (previewZoomOpen) copyPreviewToZoom();
      setPreviewStatus("预览已更新。");
    } catch {
      setPreviewStatus("预览生成失败，画布可能仍在加载。");
    }
  }, [copyPreviewToZoom, previewZoomOpen]);

  useEffect(() => {
    if (!showPosterPreview) return;

    const timer = window.setTimeout(() => {
      void refreshPosterPreview({ waitForCamera: true, timeoutMs: 3200 });
    }, 360);
    return () => window.clearTimeout(timer);
  }, [
    autoPreviewDateTime,
    focusKey,
    poster,
    refreshPosterPreview,
    selectedBodyId,
    selectedViewId,
    showEclipseAssist,
    showPosterPreview,
    timeRevision,
    visualStyleId
  ]);

  useEffect(() => {
    if (showPosterPreview) return;
    setHasPosterPreview(false);
    setPreviewZoomOpen(false);
  }, [showPosterPreview]);

  useEffect(() => {
    if (!previewZoomOpen) return;

    copyPreviewToZoom();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewZoomOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [copyPreviewToZoom, previewZoomOpen]);

  function jumpToEvent(event: CelestialEvent) {
    const eventDate = new Date(event.peaksAt ?? event.startsAt);
    if (Number.isNaN(eventDate.getTime())) return;

    setPaused(true);
    seekDate(eventDate);
    setSelectedBodyId(event.type === "lunarEclipse" ? "moon" : "earth");
    setSelectedViewId(event.recommendedView);
    setShowEclipseAssist(true);
    setFocusKey((key) => key + 1);
    setStatus(`已跳到${event.title}：${event.timeLabel}。已开启天象光影辅助。`);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await shellRef.current?.requestFullscreen();
      }
    } catch {
      setStatus("全屏切换失败，浏览器可能拦截了请求。");
    }
  }

  const allPanelsHidden = hiddenPanels.left && hiddenPanels.views && hiddenPanels.right;

  async function generatePoster(config = poster, date = currentDate, suffix = "single") {
    try {
      setStatus("正在渲染海报...");
      const canvas = await universeRef.current?.captureFrame({ waitForCamera: true, timeoutMs: 3200 });
      if (!canvas) throw new Error("宇宙画布仍在加载。");
      const blob = await composePoster(canvas, config, date);
      downloadBlob(blob, date, suffix);
      const exportedSize = outputSize(config);
      setStatus(`已下载 ${exportedSize.width} x ${exportedSize.height} PNG。`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "海报导出失败。");
    }
  }

  async function generateBatch() {
    const { rows, warnings } = parseBatch(batchText);
    if (!rows.length) {
      setStatus("没有找到有效的批量任务。");
      return;
    }

    setPaused(true);
    for (const [index, row] of rows.entries()) {
      const viewLabel = views.find((item) => item.id === row.view)?.label ?? row.view;
      setStatus(`批量 ${index + 1}/${rows.length}: 切换到 ${viewLabel}，正在渲染 ${row.text.slice(0, 28)}`);
      seekDate(row.date);
      setSelectedViewId(row.view);
      setPoster((config) => ({ ...config, text: row.text }));
      setFocusKey((key) => key + 1);
      await waitForSceneCommit();
      await generatePoster({ ...poster, text: row.text }, row.date, `batch-${index + 1}`);
      await wait(240);
    }
    setStatus(`批量完成：${rows.length} 张图片。${warnings.length ? ` ${warnings.join(" ")}` : ""}`);
  }

  return (
    <main ref={shellRef} className={styles.shell} id="main">
      <UniverseCanvas
        ref={universeRef}
        currentDate={currentDate}
        timeRevision={timeRevision}
        speed={speed}
        selectedBodyId={selectedBodyId}
        selectedViewId={selectedViewId}
        focusKey={focusKey}
        paused={paused}
        visualStyleId={visualStyleId}
        showEclipseAssist={showEclipseAssist}
        onDateChange={handleCanvasDateChange}
        onManualCamera={() => {
          setSelectedViewId("free");
        }}
        onSelect={(bodyId) => {
          setSelectedBodyId(bodyId);
          setSelectedViewId("free");
          setFocusKey((key) => key + 1);
        }}
      />

      <motion.nav className={styles.nav} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <a className={styles.brand} href="/">
          宇宙此刻
        </a>
        <div className={styles.navMeta}>
          <span>{formatBeijingDateTimeLabel(currentDate)}</span>
          <span>{moonPhaseName(states)}</span>
        </div>
      </motion.nav>

      <div className={styles.immersiveToolbar} aria-label="沉浸式控制">
        <button
          className={hiddenPanels.left ? styles.toolbarButtonActive : styles.toolbarButton}
          type="button"
          onClick={() => setHiddenPanels((value) => ({ ...value, left: !value.left }))}
        >
          <PanelLeftClose size={15} />
          {hiddenPanels.left ? "恢复左侧" : "隐藏左侧"}
        </button>
        <button
          className={hiddenPanels.views ? styles.toolbarButtonActive : styles.toolbarButton}
          type="button"
          onClick={() => setHiddenPanels((value) => ({ ...value, views: !value.views }))}
        >
          <View size={15} />
          {hiddenPanels.views ? "恢复视角" : "隐藏视角"}
        </button>
        <button
          className={hiddenPanels.right ? styles.toolbarButtonActive : styles.toolbarButton}
          type="button"
          onClick={() => setHiddenPanels((value) => ({ ...value, right: !value.right }))}
        >
          <PanelRightClose size={15} />
          {hiddenPanels.right ? "恢复右侧" : "隐藏右侧"}
        </button>
        <button
          className={allPanelsHidden ? styles.toolbarButtonActive : styles.toolbarButton}
          type="button"
          onClick={() => setHiddenPanels(allPanelsHidden ? { left: false, views: false, right: false } : { left: true, views: true, right: true })}
        >
          <RotateCcw size={15} />
          {allPanelsHidden ? "恢复全部" : "隐藏全部"}
        </button>
        <button className={isFullscreen ? styles.toolbarButtonActive : styles.toolbarButton} type="button" onClick={() => void toggleFullscreen()}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          {isFullscreen ? "退出全屏" : "全屏"}
        </button>
      </div>

      {!allPanelsHidden && (
        <motion.section className={styles.heroCopy} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.05 }}>
          <p>太阳系海报工作台</p>
          <h1>把重要的一秒，定格成一片真实的星空。</h1>
        </motion.section>
      )}

      {!hiddenPanels.left && (
        <section className={styles.leftPanel} aria-label="模拟控制">
          <PanelTitle icon={<Clock3 size={16} />} title="时间机器" />
          <label className={styles.field}>
            <span>日期与时间</span>
            <input
              type="datetime-local"
              step={1}
              value={toDatetimeLocal(currentDate)}
              onFocus={() => setPaused(true)}
              onChange={(event) => seekDate(fromDatetimeLocal(event.target.value))}
            />
          </label>
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} type="button" onClick={() => setPaused((value) => !value)}>
              {paused ? <Play size={16} /> : <Pause size={16} />}
              {paused ? "继续" : "暂停"}
            </button>
            <select aria-label="模拟速度" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
              {speeds.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} - {item.title}
                </option>
              ))}
            </select>
          </div>

          <PanelTitle icon={<Sparkles size={16} />} title="天体" />
          <div className={styles.bodyGrid}>
            {bodies.map((body) => (
              <button
                key={body.id}
                className={body.id === selectedBodyId ? styles.selectedChip : styles.chip}
                type="button"
                onClick={() => {
                  setSelectedBodyId(body.id);
                  setSelectedViewId("free");
                  setFocusKey((key) => key + 1);
                }}
              >
                {body.name}
              </button>
            ))}
          </div>
          <p className={styles.readout}>
            当前聚焦：{selectedBody?.name}。月相由场景光照实时呈现，不使用静态帧贴图。
          </p>

          <PanelTitle icon={<Sparkles size={16} />} title="特殊天象" />
          <p className={styles.eventNote}>日期和可见地区来自预置资料；3D 构图为简化太阳系模型与示意辅助，不代表精确食带路径。</p>
          <label className={styles.toggle}>
            <input type="checkbox" checked={showEclipseAssist} onChange={(event) => setShowEclipseAssist(event.target.checked)} />
            天象光影辅助
          </label>
          <div className={styles.eventList}>
            {celestialEvents.map((event) => (
              <article className={styles.eventCard} key={event.id}>
                <div className={styles.eventHeader}>
                  <span className={event.type === "solarEclipse" ? styles.solarBadge : styles.lunarBadge}>{event.type === "solarEclipse" ? "日食" : "月食"}</span>
                  <strong>{event.title}</strong>
                </div>
                <p className={styles.eventTime}>{event.timeLabel}</p>
                <p className={styles.eventPlace}>{event.locationSummary}</p>
                <p className={styles.eventDescription}>{event.description}</p>
                <p className={styles.eventVisibility}>{event.visibility}</p>
                <div className={styles.eventActions}>
                  <button className={styles.eventButton} type="button" onClick={() => jumpToEvent(event)}>
                    <Clock3 size={14} />
                    跳到时刻
                  </button>
                  {event.sourceUrl && (
                    <a className={styles.eventSource} href={event.sourceUrl} target="_blank" rel="noreferrer">
                      {event.sourceLabel ?? "来源"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {!hiddenPanels.views && (
        <section className={styles.viewRail} aria-label="视角预设">
          {views.map((view) => (
            <button
              key={view.id}
              className={view.id === selectedViewId ? styles.activeView : styles.viewButton}
              type="button"
              onClick={() => {
                setSelectedViewId(view.id);
                setFocusKey((key) => key + 1);
              }}
            >
              {view.label}
            </button>
          ))}
        </section>
      )}

      {!hiddenPanels.right && (
        <div className={styles.rightDock}>
        <section className={styles.rightPanel} aria-label="海报编辑器">
          <PanelTitle icon={<Palette size={16} />} title="视觉风格" />
          <div className={styles.styleGrid}>
            {visualStyles.map((item) => (
              <button
                key={item.id}
                className={visualStyleId === item.id ? styles.selectedStyle : styles.styleButton}
                type="button"
                title={item.note}
                onClick={() => setVisualStyleId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className={styles.attribution}>
            NASA 拟真使用 Solar System Scope 2K 贴图（CC BY 4.0，基于 NASA 影像/高程资料）并参考 NASA/JPL 行星图；其他风格保留程序材质。
          </p>

          <PanelTitle icon={<ImageIcon size={16} />} title="海报预览" />
          <div className={styles.previewControls}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={showPosterPreview} onChange={(event) => setShowPosterPreview(event.target.checked)} />
              显示预览
            </label>
            <button className={styles.inlineButton} type="button" onClick={() => void refreshPosterPreview()} disabled={!showPosterPreview}>
              <RefreshCw size={15} />
              生成/刷新预览
            </button>
            <button className={styles.inlineButton} type="button" onClick={() => setPreviewZoomOpen(true)} disabled={!showPosterPreview || !hasPosterPreview}>
              <Maximize2 size={15} />
              放大预览
            </button>
          </div>
          {showPosterPreview && (
            <>
              <div
                className={styles.posterPreview}
                style={{ aspectRatio: `${size.width} / ${size.height}` }}
                role="button"
                tabIndex={hasPosterPreview ? 0 : -1}
                onClick={() => {
                  if (hasPosterPreview) setPreviewZoomOpen(true);
                }}
                onKeyDown={(event) => {
                  if (hasPosterPreview && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    setPreviewZoomOpen(true);
                  }
                }}
                aria-label="放大查看海报位置预览"
              >
                <canvas ref={previewCanvasRef} aria-label="海报位置预览" />
              </div>
              <p className={styles.previewStatus}>{previewStatus}</p>
            </>
          )}

          <PanelTitle icon={<ImageIcon size={16} />} title="海报编辑" />
          <textarea
            className={styles.textarea}
            value={poster.text}
            onChange={(event) => setPoster({ ...poster, text: event.target.value })}
            aria-label="海报文字"
          />
          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>字体</span>
              <select value={poster.font} onChange={(event) => setPoster({ ...poster, font: event.target.value })}>
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>颜色</span>
              <input type="color" value={poster.color} onChange={(event) => setPoster({ ...poster, color: event.target.value })} />
            </label>
          </div>
          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>字号 {poster.size}</span>
              <input type="range" min={28} max={140} value={poster.size} onChange={(event) => setPoster({ ...poster, size: Number(event.target.value) })} />
            </label>
            <label className={styles.field}>
              <span>比例</span>
              <select
                value={poster.ratio}
                onChange={(event) => {
                  const ratio = event.target.value as RatioId;
                  const [width, height] = ratio === "custom" ? [poster.width, poster.height] : ratioSizes[ratio];
                  setPoster({ ...poster, ratio, width, height });
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
          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>横向位置 {Math.round(poster.x * 100)}%</span>
              <input type="range" min={0.05} max={0.95} step={0.01} value={poster.x} onChange={(event) => setPoster({ ...poster, x: Number(event.target.value) })} />
            </label>
            <label className={styles.field}>
              <span>纵向位置 {Math.round(poster.y * 100)}%</span>
              <input type="range" min={0.08} max={0.92} step={0.01} value={poster.y} onChange={(event) => setPoster({ ...poster, y: Number(event.target.value) })} />
            </label>
          </div>
          {poster.ratio === "custom" && (
            <div className={styles.twoCol}>
              <label className={styles.field}>
                <span>宽度</span>
                <input type="number" value={poster.width} onChange={(event) => setPoster({ ...poster, width: Number(event.target.value) })} />
              </label>
              <label className={styles.field}>
                <span>高度</span>
                <input type="number" value={poster.height} onChange={(event) => setPoster({ ...poster, height: Number(event.target.value) })} />
              </label>
            </div>
          )}
          <div className={styles.layoutGrid}>
            {layouts.map((layout) => (
              <button
                key={layout.id}
                className={poster.layout === layout.id ? styles.selectedChip : styles.chip}
                type="button"
                onClick={() => setPoster({ ...poster, layout: layout.id, x: layout.x, y: layout.y, align: layout.align, size: layout.size })}
              >
                {layout.label}
              </button>
            ))}
          </div>
          <div className={styles.alignGrid} aria-label="文字对齐">
            {alignments.map((alignment) => (
              <button
                key={alignment.id}
                className={poster.align === alignment.id ? styles.selectedChip : styles.chip}
                type="button"
                onClick={() => setPoster({ ...poster, align: alignment.id })}
              >
                {alignment.label}
              </button>
            ))}
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={poster.metadata} onChange={(event) => setPoster({ ...poster, metadata: event.target.checked })} />
            添加时间戳信息
          </label>
          <button className={styles.exportButton} type="button" onClick={() => generatePoster()}>
            <Download size={17} />
            导出 {size.width} x {size.height}
          </button>
        </section>

        <section className={styles.batchPanel} aria-label="批量生成">
          <PanelTitle icon={<Layers size={16} />} title="批量队列" />
          <textarea className={styles.batchInput} value={batchText} onChange={(event) => setBatchText(event.target.value)} aria-label="批量行" />
          <div className={styles.buttonRow}>
            <button className={styles.primaryButton} type="button" onClick={generateBatch}>
              <Camera size={16} />
              全部生成
            </button>
            <span className={styles.status}>{status}</span>
          </div>
        </section>
        </div>
      )}
      {previewZoomOpen && showPosterPreview && (
        <div className={styles.previewLightbox} role="dialog" aria-modal="true" aria-label="放大预览">
          <button className={styles.lightboxClose} type="button" onClick={() => setPreviewZoomOpen(false)} aria-label="关闭放大预览">
            <X size={18} />
            关闭
          </button>
          <div className={styles.lightboxCanvasWrap} style={{ aspectRatio: `${size.width} / ${size.height}` }}>
            <canvas ref={zoomCanvasRef} aria-label="放大的海报位置预览" />
          </div>
        </div>
      )}
    </main>
  );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className={styles.panelTitle}>
      {icon}
      <span>{title}</span>
    </div>
  );
}

function parseBatch(value: string): { rows: BatchRow[]; warnings: string[] } {
  const warnings: string[] = [];
  const rows = value
    .split("\n")
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => Boolean(line))
    .flatMap(({ line, lineNumber }) => {
      const [rawDate = "", text = "", rawView = ""] = line.split("|").map((part) => part.trim());
      const date = parseDatetimeLocal(rawDate.replace(" ", "T"));
      const matchedView = views.find((item) => item.id === rawView || item.label === rawView);
      const view = matchedView?.id ?? "overview";

      if (!matchedView && rawView) warnings.push(`第 ${lineNumber} 行视角“${rawView}”未识别，已使用总览。`);
      return !date || !text ? [] : [{ date, text, view }];
    });

  return { rows, warnings };
}

function waitForSceneCommit() {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }, 0);
  });
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
