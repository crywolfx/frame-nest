import { Download, Maximize2, RefreshCw } from "lucide-react";
import type { RefObject } from "react";
import { outputSize } from "../../lib/posterCore";
import type { MoonPosterConfig } from "../lib/types";
import styles from "../poster-lab.module.css";

type PosterPreviewProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  config: MoonPosterConfig;
  status: string;
  exporting: boolean;
  onRefresh: () => void;
  onExport: () => void;
  onZoom: () => void;
};

export function PosterPreview({ canvasRef, config, status, exporting, onRefresh, onExport, onZoom }: PosterPreviewProps) {
  const size = outputSize(config);

  return (
    <section className={styles.previewPanel} aria-label="海报预览">
      <div className={styles.previewToolbar}>
        <div>
          <span>实时预览</span>
          <strong>{size.width} x {size.height}</strong>
        </div>
        <div className={styles.previewActions}>
          <button className={styles.iconButton} type="button" onClick={onRefresh} aria-label="刷新预览">
            <RefreshCw size={16} />
          </button>
          <button className={styles.iconButton} type="button" onClick={onZoom} aria-label="放大预览">
            <Maximize2 size={16} />
          </button>
          <button className={styles.exportButton} type="button" onClick={onExport} disabled={exporting}>
            <Download size={17} />
            {exporting ? "导出中" : "导出 PNG"}
          </button>
        </div>
      </div>
      <button className={styles.previewCanvasButton} type="button" onClick={onZoom} aria-label="放大查看海报预览">
        <canvas ref={canvasRef} style={{ aspectRatio: `${size.width} / ${size.height}` }} />
      </button>
      <p className={styles.previewStatus}>{status}</p>
    </section>
  );
}
