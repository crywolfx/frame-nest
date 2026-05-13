"use client";

import { motion } from "motion/react";
import { Camera, Clock3, Download, Image as ImageIcon, Layers, Pause, Play, Sparkles } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { UniverseCanvas, type UniverseHandle } from "./components/UniverseCanvas";
import styles from "./cosmic.module.css";
import { bodies } from "./lib/bodies";
import { getSolarSystemState, moonPhaseName } from "./lib/orbits";
import { composePoster, downloadBlob, outputSize, ratioSizes } from "./lib/poster";
import { fromDatetimeLocal, speeds, toDatetimeLocal } from "./lib/time";
import type { BatchRow, BodyId, PosterConfig, RatioId, ViewPresetId } from "./lib/types";

const views: { id: ViewPresetId; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "earth", label: "Earth" },
  { id: "moon", label: "Moon" },
  { id: "sun", label: "Sun" },
  { id: "earthToMoon", label: "Earth -> Moon" },
  { id: "moonToEarth", label: "Moon -> Earth" },
  { id: "overview", label: "Overview" },
  { id: "top", label: "Top" },
  { id: "cinematic", label: "Cinematic" }
];

const fonts = ["Avenir Next", "Georgia", "Times New Roman", "Helvetica Neue", "PingFang SC", "monospace"];
const layouts: { id: PosterConfig["layout"]; label: string; x: number; y: number; align: CanvasTextAlign; size: number }[] = [
  { id: "lowerLeft", label: "Lower left", x: 0.1, y: 0.78, align: "left", size: 72 },
  { id: "center", label: "Center title", x: 0.5, y: 0.5, align: "center", size: 86 },
  { id: "upperRight", label: "Upper right", x: 0.9, y: 0.18, align: "right", size: 54 },
  { id: "caption", label: "Quiet caption", x: 0.08, y: 0.88, align: "left", size: 42 }
];

const defaultPoster: PosterConfig = {
  text: "When the sky kept our time.",
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

const defaultBatch = `2026-05-13 21:30:15 | The night we looked up | earthToMoon
2026-06-01 00:00:00 | June sky | overview`;

export default function CosmicMomentApp({ initialIso }: { initialIso: string }) {
  const universeRef = useRef<UniverseHandle>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date(initialIso));
  const [paused, setPaused] = useState(true);
  const [speed, setSpeed] = useState<number>(60);
  const [selectedBodyId, setSelectedBodyId] = useState<BodyId>("earth");
  const [selectedViewId, setSelectedViewId] = useState<ViewPresetId>("overview");
  const [focusKey, setFocusKey] = useState(0);
  const [poster, setPoster] = useState<PosterConfig>(defaultPoster);
  const [batchText, setBatchText] = useState(defaultBatch);
  const [status, setStatus] = useState("Ready to render.");
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
      setStatus("Rendering poster...");
      const canvas = await universeRef.current?.captureFrame();
      if (!canvas) throw new Error("The universe is still loading.");
      const blob = await composePoster(canvas, config, date, views.find((item) => item.id === view)?.label ?? view);
      downloadBlob(blob, date, suffix);
      setStatus(`Downloaded ${size.width} x ${size.height} PNG.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Poster export failed.");
    }
  }

  async function generateBatch() {
    const rows = parseBatch(batchText);
    if (!rows.length) {
      setStatus("No valid batch rows found.");
      return;
    }

    setPaused(true);
    for (const [index, row] of rows.entries()) {
      setStatus(`Batch ${index + 1}/${rows.length}: rendering ${row.text.slice(0, 36)}`);
      setCurrentDate(row.date);
      setSelectedViewId(row.view);
      setPoster((config) => ({ ...config, text: row.text }));
      setFocusKey((key) => key + 1);
      await wait(850);
      await generatePoster({ ...poster, text: row.text }, row.date, row.view, `batch-${index + 1}`);
      await wait(240);
    }
    setStatus(`Batch complete: ${rows.length} image${rows.length === 1 ? "" : "s"}.`);
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
        onSelect={(bodyId) => {
          setSelectedBodyId(bodyId);
          setSelectedViewId("free");
          setFocusKey((key) => key + 1);
        }}
      />

      <motion.nav className={styles.nav} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <a className={styles.brand} href="/">
          Cosmic Moment
        </a>
        <div className={styles.navMeta}>
          <span>{currentDate.toISOString()}</span>
          <span>{moonPhaseName(states)}</span>
        </div>
      </motion.nav>

      <motion.section className={styles.heroCopy} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.05 }}>
        <p>Solar poster studio</p>
        <h1>Frame a sky at the exact second it mattered.</h1>
      </motion.section>

      <section className={styles.leftPanel} aria-label="Simulation controls">
        <PanelTitle icon={<Clock3 size={16} />} title="Time machine" />
        <label className={styles.field}>
          <span>Date and time</span>
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
            {paused ? "Resume" : "Pause"}
          </button>
          <select aria-label="Simulation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
            {speeds.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label} - {item.title}
              </option>
            ))}
          </select>
        </div>

        <PanelTitle icon={<Sparkles size={16} />} title="Bodies" />
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
          Focus: {selectedBody?.name}. Moon phase is rendered by scene lighting, not image frames.
        </p>
      </section>

      <section className={styles.viewRail} aria-label="View presets">
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

      <section className={styles.rightPanel} aria-label="Poster composer">
        <PanelTitle icon={<ImageIcon size={16} />} title="Poster composer" />
        <textarea
          className={styles.textarea}
          value={poster.text}
          onChange={(event) => setPoster({ ...poster, text: event.target.value })}
          aria-label="Poster text"
        />
        <div className={styles.twoCol}>
          <label className={styles.field}>
            <span>Font</span>
            <select value={poster.font} onChange={(event) => setPoster({ ...poster, font: event.target.value })}>
              {fonts.map((font) => (
                <option key={font}>{font}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Color</span>
            <input type="color" value={poster.color} onChange={(event) => setPoster({ ...poster, color: event.target.value })} />
          </label>
        </div>
        <div className={styles.twoCol}>
          <label className={styles.field}>
            <span>Size</span>
            <input type="range" min={28} max={140} value={poster.size} onChange={(event) => setPoster({ ...poster, size: Number(event.target.value) })} />
          </label>
          <label className={styles.field}>
            <span>Ratio</span>
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
              <option value="custom">Custom</option>
            </select>
          </label>
        </div>
        <div className={styles.twoCol}>
          <label className={styles.field}>
            <span>X position</span>
            <input type="range" min={0.05} max={0.95} step={0.01} value={poster.x} onChange={(event) => setPoster({ ...poster, x: Number(event.target.value) })} />
          </label>
          <label className={styles.field}>
            <span>Y position</span>
            <input type="range" min={0.08} max={0.92} step={0.01} value={poster.y} onChange={(event) => setPoster({ ...poster, y: Number(event.target.value) })} />
          </label>
        </div>
        {poster.ratio === "custom" && (
          <div className={styles.twoCol}>
            <label className={styles.field}>
              <span>Width</span>
              <input type="number" value={poster.width} onChange={(event) => setPoster({ ...poster, width: Number(event.target.value) })} />
            </label>
            <label className={styles.field}>
              <span>Height</span>
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
          Add timestamp metadata
        </label>
        <button className={styles.exportButton} type="button" onClick={() => generatePoster()}>
          <Download size={17} />
          Export {size.width} x {size.height}
        </button>
      </section>

      <section className={styles.batchPanel} aria-label="Batch generation">
        <PanelTitle icon={<Layers size={16} />} title="Batch queue" />
        <textarea className={styles.batchInput} value={batchText} onChange={(event) => setBatchText(event.target.value)} aria-label="Batch rows" />
        <div className={styles.buttonRow}>
          <button className={styles.primaryButton} type="button" onClick={generateBatch}>
            <Camera size={16} />
            Generate all
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
      const view = views.some((item) => item.id === rawView) ? (rawView as ViewPresetId) : "overview";
      return Number.isNaN(date.getTime()) || !text ? [] : [{ date, text, view }];
    });
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
