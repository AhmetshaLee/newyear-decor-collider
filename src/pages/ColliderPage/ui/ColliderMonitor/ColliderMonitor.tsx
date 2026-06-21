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
    <div className={styles.monitorPanel}>
      <div className={styles.monitorBezel}>
        <div className={styles.screen}>
          <p className={styles.screenLine}>
            Осталось осколков: {availableShards}
          </p>
          <div className={styles.divider} />
          <p className={styles.projectTitle}>{projectTitle}</p>
          <p className={styles.screenLine}>Уровень: {levelName}</p>
          <p className={styles.screenLine}>Альбом: {albumName}</p>
          <p className={styles.screenLine}>
            Тип украшения: {decorationTypeName}
          </p>
          <p className={styles.screenLine}>
            Антиповторитель: {antiRepeatModeName}
          </p>
        </div>
      </div>
    </div>
  )
}
