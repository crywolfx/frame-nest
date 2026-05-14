import { Camera, Layers } from "lucide-react";
import { PanelTitle } from "./PanelTitle";
import type { BatchRow } from "../lib/types";
import styles from "../poster-lab.module.css";

type BatchPanelProps = {
  value: string;
  rows: BatchRow[];
  status: string;
  running: boolean;
  onChange: (value: string) => void;
  onGenerate: () => void;
};

export function BatchPanel({ value, rows, status, running, onChange, onGenerate }: BatchPanelProps) {
  return (
    <section className={styles.batchPanel} aria-label="批量生成">
      <PanelTitle icon={<Layers size={16} />} title="批量队列" />
      <textarea className={styles.batchInput} value={value} onChange={(event) => onChange(event.target.value)} aria-label="批量行" />
      <div className={styles.batchActions}>
        <button className={styles.primaryButton} type="button" onClick={onGenerate} disabled={running}>
          <Camera size={16} />
          {running ? "生成中" : "全部生成"}
        </button>
        <span className={styles.status}>{status}</span>
      </div>
      {!!rows.length && (
        <div className={styles.queueList} aria-label="批量状态">
          {rows.map((row) => (
            <div className={styles.queueRow} key={row.id}>
              <span>{String(row.lineNumber).padStart(2, "0")}</span>
              <strong>{row.phaseLabel}</strong>
              <em>{row.status}</em>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
