import styles from './ColliderMonitor.module.scss'

type ColliderMonitorProps = {
  availableShards: number
  projectTitle: string
  levelName: string
  albumName: string
  decorationTypeName: string
  antiRepeatModeName: string
}

export function ColliderMonitor({
  availableShards,
  projectTitle,
  levelName,
  albumName,
  decorationTypeName,
  antiRepeatModeName,
}: ColliderMonitorProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.bezel}>
        <div className={styles.screen}>
          <p className={styles.line}>Осталось осколков: {availableShards}</p>
          <div className={styles.divider} />
          <p className={styles.title}>{projectTitle}</p>
          <p className={styles.line}>Уровень: {levelName}</p>
          <p className={styles.line}>Альбом: {albumName}</p>
          <p className={styles.line}>Тип украшения: {decorationTypeName}</p>
          <p className={styles.line}>
            Антиповторитель: {antiRepeatModeName}
          </p>
        </div>
      </div>
    </div>
  )
}
