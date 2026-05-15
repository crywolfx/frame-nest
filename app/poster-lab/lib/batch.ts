import { parseBeijingDateAtEvening, parseDatetimeLocal } from "../../lib/time";
import { moonPhaseFromDate, resolvePhaseToken } from "./moonPhases";
import type { ParsedBatch } from "./types";

function parseBatchDate(value: string) {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return parseBeijingDateAtEvening(trimmed);
  return parseDatetimeLocal(trimmed.replace(" ", "T"));
}

export function parseBatchRows(value: string): ParsedBatch {
  const warnings: string[] = [];
  const rows = value
    .split("\n")
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(({ line }) => Boolean(line))
    .flatMap(({ line, lineNumber }) => {
      const [rawDate = "", rawPhase = "auto", text = ""] = line.split("|").map((part) => part.trim());
      const date = parseBatchDate(rawDate);

      if (!date) {
        warnings.push(`第 ${lineNumber} 行日期无效，已跳过。`);
        return [];
      }

      if (!text) {
        warnings.push(`第 ${lineNumber} 行文案为空，已跳过。`);
        return [];
      }

      const resolved = resolvePhaseToken(rawPhase, date);
      if (resolved.warning) warnings.push(`第 ${lineNumber} 行${resolved.warning}`);
      const computed = moonPhaseFromDate(date).phase;
      const phase = rawPhase ? resolved.phase : computed;

      return [{
        id: `batch-${lineNumber}-${date.getTime()}`,
        lineNumber,
        date,
        phaseMode: resolved.phaseMode,
        phaseIndex: phase.index,
        phaseLabel: phase.nameZh,
        text,
        status: "等待" as const
      }];
    });

  return { rows, warnings };
}
