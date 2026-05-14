import styles from "../poster-lab.module.css";

export function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className={styles.panelTitle}>
      {icon}
      <span>{title}</span>
    </div>
  );
}
