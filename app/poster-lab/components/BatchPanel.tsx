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
      <div className={styles.batchHelp}>
        <strong>每行：日期 | 月相 | 文案</strong>
        <span>只写 YYYY-MM-DD 时按北京时间当天 20:00；写 YYYY-MM-DD HH:mm 或 YYYY-MM-DDTHH:mm 时按输入的北京时间。</span>
        <span>月相可填 auto、phase-01 到 phase-30、1 到 30，或中文月相名如 满月。</span>
        <code>2026-05-17 | auto | 月相观测记录</code>
        <code>2026-05-17 21:30 | auto | 晚间观测记录</code>
        <code>2026-05-17 | 满月 | 满月记录</code>
      </div>
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
