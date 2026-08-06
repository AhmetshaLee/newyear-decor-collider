import { type ReactNode } from 'react'

import styles from './StatusMonitor.module.scss'

type StatusMonitorProps = {
  availableShards: number
  projectTitle: string
  levelLabel: string
  albumLabel: string
  decorationTypeLabel: string
  antiRepeatModeLabel: string
  controls?: ReactNode
  footerLabel?: ReactNode
}

export function StatusMonitor({
  availableShards,
  projectTitle,
  levelLabel,
  albumLabel,
  decorationTypeLabel,
  antiRepeatModeLabel,
  controls,
  footerLabel,
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

        {(controls !== undefined || footerLabel !== undefined) && (
          <div className={styles.footer}>
            <div className={styles.controls}>{controls}</div>
            <span className={styles.footerLabel}>{footerLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
