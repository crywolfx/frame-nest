import { formatPhaseDisplayNumber, moonPhases } from "../lib/moonPhases";
import styles from "../poster-lab.module.css";

type MoonPhaseSelectorProps = {
  selectedIndex: number;
  computedIndex: number;
  onSelect: (index: number) => void;
};

export function MoonPhaseSelector({ selectedIndex, computedIndex, onSelect }: MoonPhaseSelectorProps) {
  return (
    <div className={styles.phaseGrid} aria-label="月相档位">
      {moonPhases.map((phase) => (
        <button
          key={phase.id}
          className={phase.index === selectedIndex ? styles.phaseButtonActive : styles.phaseButton}
          type="button"
          onClick={() => onSelect(phase.index)}
          aria-label={`${phase.nameZh} 相位 ${formatPhaseDisplayNumber(phase.index)}`}
        >
          <img src={phase.assetPath} alt="" loading="lazy" />
          <span>{formatPhaseDisplayNumber(phase.index)}</span>
          <strong>{phase.nameZh}</strong>
          {phase.index === computedIndex && <em>日期</em>}
        </button>
      ))}
    </div>
  );
}
