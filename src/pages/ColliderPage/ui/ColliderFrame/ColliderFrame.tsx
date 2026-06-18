import { useState } from 'react'

import styles from './ColliderFrame.module.scss'

type MonitorState = {
  userShards: number
  decorationProject: string
  selectedLevel: string
  selectedCollection: string
  selectedType: string
  isAntiRepeatOn: boolean
}

const INITIAL_MONITOR_STATE: MonitorState = {
  // shards, project, level, album, decorationType, antiRepeat.
  userShards: 10210,
  decorationProject: 'Проект украшения',
  selectedLevel: 'II',
  selectedCollection: 'Отечественный',
  selectedType: 'Подарок под ель',
  isAntiRepeatOn: false,
}

export function ColliderFrame() {
  const [monitorState] = useState<MonitorState>(INITIAL_MONITOR_STATE)

  return (
    <section className={styles.frame}>
      <div className={styles.monitorPanel}>
        <div className={styles.monitorBezel}>
          <div className={styles.screen} aria-label="ЖК-экран коллайдера">
            <p className={styles.shardsLine}>
              Осталось осколков: {monitorState.userShards}
            </p>
            <div className={styles.divider} />

            <p className={styles.projectLine}>
              {monitorState.decorationProject}
            </p>
            <p>Уровень: {monitorState.selectedLevel}</p>
            <p>Альбом: {monitorState.selectedCollection}</p>
            <p>Тип украшения: {monitorState.selectedType}</p>
            <p>
              Антиповторитель:{' '}
              {monitorState.isAntiRepeatOn ? 'Включен' : 'Выключен'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
