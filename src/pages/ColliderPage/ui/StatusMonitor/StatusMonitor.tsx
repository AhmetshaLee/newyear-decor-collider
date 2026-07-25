import styles from './StatusMonitor.module.scss'

type StatusMonitorProps = {
  availableShards: number
  projectTitle: string
  levelLabel: string
  albumLabel: string
  decorationTypeLabel: string
  antiRepeatModeLabel: string
}

export function StatusMonitor({
  availableShards,
  projectTitle,
  levelLabel,
  albumLabel,
  decorationTypeLabel,
  antiRepeatModeLabel,
}: StatusMonitorProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.bezel}>
        <div className={styles.screen}>
          <p className={styles.line}>Осталось осколков: {availableShards}</p>
          <div className={styles.divider} />
          <p className={styles.title}>{projectTitle}</p>
          <p className={styles.line}>Уровень: {levelLabel}</p>
          <p className={styles.line}>Альбом: {albumLabel}</p>
          <p className={styles.line}>Тип украшения: {decorationTypeLabel}</p>
          <p className={styles.line}>Антиповторитель: {antiRepeatModeLabel}</p>
        </div>
      </div>
    </div>
  )
}
