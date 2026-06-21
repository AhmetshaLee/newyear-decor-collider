import { useState, type CSSProperties } from 'react'
import { ShardCostCounter } from '../ShardCostCounter'

import styles from './ColliderFrame.module.scss'

type AlbumValue = 'random' | 'classic' | 'fairytale' | 'oriental' | 'magic'
type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'

type MonitorState = {
  userShards: number
  decorationProject: string
  selectedLevel: string
  selectedAlbum: AlbumValue
  selectedType: DecorationTypeValue
  isAntiRepeatOn: boolean
}

type AlbumOption = {
  value: AlbumValue
  icon: string
  displayName: string
  angle: number
}

const INITIAL_MONITOR_STATE: MonitorState = {
  userShards: 10210,
  decorationProject: 'Проект украшения',
  selectedLevel: 'II',
  selectedAlbum: 'classic',
  selectedType: 'floor',
  isAntiRepeatOn: false,
}

const TYPE_DISPLAY_NAME: Record<DecorationTypeValue, string> = {
  random: 'Случайный',
  top: 'Верхушка',
  lights: 'Гирлянды',
  toys: 'Навесные игрушки',
  floor: 'Нижние игрушки',
}

const ALBUM_OPTIONS: AlbumOption[] = [
  {
    value: 'random',
    icon: '?',
    displayName: 'Случайный',
    angle: -180,
  },
  {
    value: 'classic',
    icon: '*',
    displayName: 'Новогодняя классика',
    angle: -135,
  },
  {
    value: 'fairytale',
    icon: 'C',
    displayName: 'Рождественская сказка',
    angle: -90,
  },
  {
    value: 'oriental',
    icon: '福',
    displayName: 'Восточный календарь',
    angle: -45,
  },
  {
    value: 'magic',
    icon: '+',
    displayName: 'Зимнее чудо',
    angle: 0,
  },
]

const ALBUM_TICK_ANGLES = [
  -180, -157.5, -135, -112.5, -90, -67.5, -45, -22.5, 0,
]

const displayedCraftCost = 120

const getAlbumOption = (value: AlbumValue) => {
  return (
    ALBUM_OPTIONS.find((albumOption) => albumOption.value === value) ??
    ALBUM_OPTIONS[0]
  )
}

export function ColliderFrame() {
  const [monitorState, setMonitorState] = useState<MonitorState>(
    INITIAL_MONITOR_STATE,
  )

  const selectedAlbumOption = getAlbumOption(monitorState.selectedAlbum)

  const selectAlbum = (albumValue: AlbumValue) => {
    setMonitorState((currentState) => ({
      ...currentState,
      selectedAlbum: albumValue,
    }))
  }

  const selectNextAlbum = () => {
    const currentIndex = ALBUM_OPTIONS.findIndex(
      (albumOption) => albumOption.value === monitorState.selectedAlbum,
    )
    const nextAlbumOption =
      ALBUM_OPTIONS[(currentIndex + 1) % ALBUM_OPTIONS.length]

    selectAlbum(nextAlbumOption.value)
  }

  const selectType = (decorationType: DecorationTypeValue) => {
    setMonitorState((currentState) => ({
      ...currentState,
      selectedType: decorationType,
    }))
  }

  return (
    <section className={styles.frame}>
      <div className={styles.panelGrid}>
        <div className={styles.monitorPanel}>
          <div className={styles.monitorBezel}>
            <div className={styles.screen}>
              <p className={styles.screenLine}>
                Осталось осколков: {monitorState.userShards}
              </p>
              <div className={styles.divider} />
              <p className={styles.projectTitle}>
                {monitorState.decorationProject}
              </p>
              <p className={styles.screenLine}>
                Уровень: {monitorState.selectedLevel}
              </p>
              <p className={styles.screenLine}>
                Альбом: {selectedAlbumOption.displayName}
              </p>
              <p className={styles.screenLine}>
                Тип украшения: {TYPE_DISPLAY_NAME[monitorState.selectedType]}
              </p>
              <p className={styles.screenLine}>
                Антиповторитель:{' '}
                {monitorState.isAntiRepeatOn ? 'Включен' : 'Выключен'}
              </p>
            </div>
          </div>
        </div>

        <section className={styles.rotorPanel}>
          <h2 className={styles.rotorTitle}>Альбом</h2>

          <div className={styles.rotorScale}>
            {ALBUM_TICK_ANGLES.map((tickAngle) => (
              <span
                className={`${styles.rotorTick} ${
                  ALBUM_OPTIONS.some(
                    (albumOption) => albumOption.angle === tickAngle,
                  )
                    ? styles.majorTick
                    : ''
                }`}
                key={tickAngle}
                style={
                  {
                    '--tick-angle': `${tickAngle}deg`,
                  } as CSSProperties
                }
              />
            ))}

            {ALBUM_OPTIONS.map((albumOption) => (
              <button
                className={`${styles.rotorIcon} ${
                  albumOption.value === monitorState.selectedAlbum
                    ? styles.activeRotorIcon
                    : ''
                }`}
                key={albumOption.value}
                type="button"
                style={
                  {
                    '--icon-angle': `${albumOption.angle}deg`,
                    '--icon-upright-angle': `${-albumOption.angle}deg`,
                  } as CSSProperties
                }
                onClick={() => selectAlbum(albumOption.value)}
              >
                {albumOption.icon}
              </button>
            ))}

            <button
              className={styles.rotorKnob}
              type="button"
              style={
                {
                  '--rotor-angle': `${selectedAlbumOption.angle + 90}deg`,
                } as CSSProperties
              }
              onClick={selectNextAlbum}
            >
              <span className={styles.rotorPointer} />
            </button>
          </div>
        </section>

        <section className={styles.typePanel}>
          <h2 className={styles.typePanelTitle}>Тип украшения</h2>
          <div className={styles.typePanelBody}>
            <div className={styles.typeButtonGroup}>
              <span className={styles.typeButtonFrame}>
                <button
                  className={`${styles.typeButton} ${monitorState.selectedType === 'random' ? styles.activeTypeButton : ''}`}
                  type="button"
                  onClick={() => selectType('random')}
                >
                  ?
                </button>
              </span>
              <span className={styles.typeButtonFrame}>
                <button
                  className={`${styles.typeButton} ${monitorState.selectedType === 'floor' ? styles.activeTypeButton : ''}`}
                  type="button"
                  onClick={() => selectType('floor')}
                >
                  ◆
                </button>
              </span>
            </div>
          </div>
        </section>

        <div className={styles.costControl}>
          <ShardCostCounter value={displayedCraftCost} />
        </div>
      </div>
    </section>
  )
}
