"use client";

import { motion } from "motion/react";
import { Camera, Clock3, Download, Image as ImageIcon, Layers, Palette, Pause, Play, Sparkles } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { UniverseCanvas, type UniverseHandle } from "./components/UniverseCanvas";
import styles from "./cosmic.module.css";
import { bodies } from "./lib/bodies";
import { getSolarSystemState, moonPhaseName } from "./lib/orbits";
import { composePoster, downloadBlob, outputSize, ratioSizes } from "./lib/poster";
import { fromDatetimeLocal, speeds, toDatetimeLocal } from "./lib/time";
import type { BatchRow, BodyId, PosterConfig, RatioId, ViewPresetId, VisualStyleId } from "./lib/types";

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
  { id: "nasa", label: "NASA 拟真", note: "基于公开天体影像特征的程序材质" },
  { id: "cinema", label: "电影宇宙", note: "高反差光晕与暖色镜头感" },
  { id: "instrument", label: "暗夜仪器", note: "低饱和观测屏幕与细轨道线" },
  { id: "neon", label: "霓虹星图", note: "高亮边缘与星图式色彩" }
];

const fonts = [
  { value: "Avenir Next", label: "现代无衬线" },
  { value: "Georgia", label: "经典衬线" },
  { value: "Times New Roman", label: "报刊衬线" },
  { value: "Helvetica Neue", label: "瑞士无衬线" },
  { value: "PingFang SC", label: "苹方中文" },
  { value: "monospace", label: "等宽数字" }
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
  const universeRef = useRef<UniverseHandle>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date(initialIso));
  const [paused, setPaused] = useState(true);
  const [speed, setSpeed] = useState<number>(60);
  const [selectedBodyId, setSelectedBodyId] = useState<BodyId>("earth");
  const [selectedViewId, setSelectedViewId] = useState<ViewPresetId>("overview");
  const [visualStyleId, setVisualStyleId] = useState<VisualStyleId>("nasa");
  const [focusKey, setFocusKey] = useState(0);
  const [poster, setPoster] = useState<PosterConfig>(defaultPoster);
  const [batchText, setBatchText] = useState(defaultBatch);
  const [status, setStatus] = useState("已准备渲染。");
  const states = useMemo(() => getSolarSystemState(currentDate), [currentDate]);
  const selectedBody = bodies.find((body) => body.id === selectedBodyId);
  const size = outputSize(poster);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (paused) return;

    let last = performance.now();
    const tick = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - last;
      last = now;
      setCurrentDate((date) => new Date(date.getTime() + elapsed * speed));
    }, 250);

    return () => window.clearInterval(tick);
  }, [paused, speed]);

  async function generatePoster(config = poster, date = currentDate, view = selectedViewId, suffix = "single") {
    try {
      setStatus("正在渲染海报...");
      const canvas = await universeRef.current?.captureFrame();
      if (!canvas) throw new Error("宇宙画布仍在加载。");
      const blob = await composePoster(canvas, config, date, views.find((item) => item.id === view)?.label ?? view);
      downloadBlob(blob, date, suffix);
      setStatus(`已下载 ${size.width} x ${size.height} PNG。`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "海报导出失败。");
    }
  }

  async function generateBatch() {
    const rows = parseBatch(batchText);
    if (!rows.length) {
      setStatus("没有找到有效的批量任务。");
      return;
    }

    setPaused(true);
    for (const [index, row] of rows.entries()) {
      setStatus(`批量 ${index + 1}/${rows.length}: 正在渲染 ${row.text.slice(0, 36)}`);
      setCurrentDate(row.date);
      setSelectedViewId(row.view);
      setPoster((config) => ({ ...config, text: row.text }));
      setFocusKey((key) => key + 1);
      await wait(850);
      await generatePoster({ ...poster, text: row.text }, row.date, row.view, `batch-${index + 1}`);
      await wait(240);
    }
    setStatus(`批量完成：${rows.length} 张图片。`);
  }

  return (
    <main className={styles.shell} id="main">
      <UniverseCanvas
        ref={universeRef}
        states={states}
        selectedBodyId={selectedBodyId}
        selectedViewId={selectedViewId}
        focusKey={focusKey}
        paused={paused}
        visualStyleId={visualStyleId}
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
          <span>{currentDate.toISOString()}</span>
          <span>{moonPhaseName(states)}</span>
        </div>
      </motion.nav>

      <motion.section className={styles.heroCopy} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.05 }}>
        <p>太阳系海报工作台</p>
        <h1>把重要的一秒，定格成一片真实的星空。</h1>
      </motion.section>

      <section className={styles.leftPanel} aria-label="模拟控制">
        <PanelTitle icon={<Clock3 size={16} />} title="时间机器" />
        <label className={styles.field}>
          <span>日期与时间</span>
          <input
            type="datetime-local"
            step={1}
            value={toDatetimeLocal(currentDate)}
            onFocus={() => setPaused(true)}
            onChange={(event) => setCurrentDate(fromDatetimeLocal(event.target.value))}
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
      </section>

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
          材质为程序生成，参考 NASA/JPL 公开行星影像与任务图库的颜色、云带、环系和地形特征；未加载外部贴图文件。
        </p>

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
            <span>字号</span>
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
            <span>横向位置</span>
            <input type="range" min={0.05} max={0.95} step={0.01} value={poster.x} onChange={(event) => setPoster({ ...poster, x: Number(event.target.value) })} />
          </label>
          <label className={styles.field}>
            <span>纵向位置</span>
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

function parseBatch(value: string): BatchRow[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [rawDate, text, rawView] = line.split("|").map((part) => part.trim());
      const date = new Date(rawDate.replace(" ", "T"));
      const view = views.find((item) => item.id === rawView || item.label === rawView)?.id ?? "overview";
      return Number.isNaN(date.getTime()) || !text ? [] : [{ date, text, view }];
    });
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
