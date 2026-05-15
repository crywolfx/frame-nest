import { formatLunarDayName } from "../lib/lunar";
import { moonPhases } from "../lib/moonPhases";
import styles from "../poster-lab.module.css";

type MoonPhaseSelectorProps = {
  selectedIndex: number;
  computedIndex: number;
  monthDayCount: number;
  onSelect: (index: number) => void;
};

export function MoonPhaseSelector({ selectedIndex, computedIndex, monthDayCount, onSelect }: MoonPhaseSelectorProps) {
  const visiblePhases = moonPhases.slice(0, monthDayCount);

  return (
    <div className={styles.phaseGrid} aria-label="农历月相">
      {visiblePhases.map((phase) => (
        <button
          key={phase.id}
          className={phase.index === selectedIndex ? styles.phaseButtonActive : styles.phaseButton}
          type="button"
          onClick={() => onSelect(phase.index)}
          aria-label={`${formatLunarDayName(phase.index + 1)} ${phase.nameZh}`}
        >
          <img src={phase.assetPath} alt="" loading="lazy" />
          <span>{formatLunarDayName(phase.index + 1)}</span>
          <strong>{phase.nameZh}</strong>
          {phase.index === computedIndex && <em>日期</em>}
        </button>
      ))}
    </div>
  );
}
