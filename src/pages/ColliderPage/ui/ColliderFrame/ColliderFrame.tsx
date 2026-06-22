import { useState, type CSSProperties } from 'react'
import { ColliderMonitor } from '../ColliderMonitor'
import { ColliderControlLabel } from '../ColliderControlLabel'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { ShardCostCounter } from '../ShardCostCounter'

import styles from './ColliderFrame.module.scss'

type AlbumValue = 'random' | 'classic' | 'fairytale' | 'oriental' | 'magic'
type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'
type AntiRepeatMode = 'off' | 'useShards'

type MonitorState = {
  userShards: number
  decorationProject: string
  selectedLevel: string
  selectedAlbum: AlbumValue
  selectedType: DecorationTypeValue
  selectedAntiRepeatMode: AntiRepeatMode
}

type DecorationTypeOption = {
  value: DecorationTypeValue
  icon: string
  label: string
}

type AlbumOption = {
  value: AlbumValue
  icon: string
  displayName: string
  angle: number
}

type AntiRepeatOption = {
  value: AntiRepeatMode
  label: string
  displayName: string
  angle: number
  labelOffset: number
}

const INITIAL_MONITOR_STATE: MonitorState = {
  userShards: 10210,
  decorationProject: 'Проект украшения',
  selectedLevel: 'II',
  selectedAlbum: 'classic',
  selectedType: 'random',
  selectedAntiRepeatMode: 'off',
}

const TYPE_DISPLAY_NAME: Record<DecorationTypeValue, string> = {
  random: 'Случайный',
  top: 'Верхушка',
  lights: 'Гирлянды',
  toys: 'Навесные игрушки',
  floor: 'Нижние игрушки',
}

const DECORATION_TYPE_OPTIONS = [
  { value: 'top', icon: '▲', label: 'Верхушка' },
  { value: 'lights', icon: '✦', label: 'Гирлянды' },
  { value: 'toys', icon: '◆', label: 'Навесные игрушки' },
  { value: 'floor', icon: '▣', label: 'Нижние игрушки' },
] satisfies DecorationTypeOption[]

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

const ANTI_REPEAT_OPTIONS: AntiRepeatOption[] = [
  {
    value: 'off',
    label: 'Выкл',
    displayName: 'Выключен',
    angle: 0,
    labelOffset: 112,
  },
  {
    value: 'useShards',
    label: 'Оск',
    displayName: 'За осколки',
    angle: 80,
    labelOffset: 96,
  },
]

const ANTI_REPEAT_TICK_ANGLES = [0, 80]

const displayedCraftCost = 120

const getAlbumOption = (value: AlbumValue) => {
  return (
    ALBUM_OPTIONS.find((albumOption) => albumOption.value === value) ??
    ALBUM_OPTIONS[0]
  )
}

const getAntiRepeatOption = (value: AntiRepeatMode) => {
  return (
    ANTI_REPEAT_OPTIONS.find(
      (antiRepeatOption) => antiRepeatOption.value === value,
    ) ?? ANTI_REPEAT_OPTIONS[0]
  )
}

export function ColliderFrame() {
  const [monitorState, setMonitorState] = useState<MonitorState>(
    INITIAL_MONITOR_STATE,
  )

  const selectedAlbumOption = getAlbumOption(monitorState.selectedAlbum)
  const selectedAntiRepeatOption = getAntiRepeatOption(
    monitorState.selectedAntiRepeatMode,
  )

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

  const selectAntiRepeatMode = (antiRepeatMode: AntiRepeatMode) => {
    setMonitorState((currentState) => ({
      ...currentState,
      selectedAntiRepeatMode: antiRepeatMode,
    }))
  }

  const selectNextAntiRepeatMode = () => {
    const currentIndex = ANTI_REPEAT_OPTIONS.findIndex(
      (antiRepeatOption) =>
        antiRepeatOption.value === monitorState.selectedAntiRepeatMode,
    )
    const nextAntiRepeatOption =
      ANTI_REPEAT_OPTIONS[(currentIndex + 1) % ANTI_REPEAT_OPTIONS.length]

    selectAntiRepeatMode(nextAntiRepeatOption.value)
  }

  return (
    <section className={styles.frame}>
      <div className={styles.panelGrid}>
        <div className={styles.monitorSlot}>
          <ColliderMonitor
            availableShards={monitorState.userShards}
            projectTitle={monitorState.decorationProject}
            levelName={monitorState.selectedLevel}
            albumName={selectedAlbumOption.displayName}
            decorationTypeName={TYPE_DISPLAY_NAME[monitorState.selectedType]}
            antiRepeatModeName={selectedAntiRepeatOption.displayName}
          />
        </div>
        <section className={styles.rotorPanel}>
          <h2 className={styles.rotorTitle}>Альбом</h2>

          <div className={styles.rotorScale}>
            <svg className={styles.rotorArc} viewBox="0 0 230 160">
              <path d="M 35 132 A 80 80 0 0 1 195 132" />
            </svg>

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
          <div className={styles.typeControl}>
            <ColliderControlLabel>Случайный</ColliderControlLabel>
            <DecorationTypeButtonGroup>
              <DecorationTypeButton
                isSelected={monitorState.selectedType === 'random'}
                onClick={() => selectType('random')}
              >
                ?
              </DecorationTypeButton>
            </DecorationTypeButtonGroup>
          </div>

          <div className={styles.typeControl}>
            <ColliderControlLabel>Тип украшения</ColliderControlLabel>
            <DecorationTypeButtonGroup>
              {DECORATION_TYPE_OPTIONS.map((typeOption) => {
                const isSelected =
                  monitorState.selectedType === typeOption.value

                return (
                  <DecorationTypeButton
                    isSelected={isSelected}
                    key={typeOption.value}
                    onClick={() => selectType(typeOption.value)}
                  >
                    {typeOption.icon}
                  </DecorationTypeButton>
                )
              })}
            </DecorationTypeButtonGroup>
          </div>
        </section>

        <section className={`${styles.rotorPanel} ${styles.antiRepeatPanel}`}>
          <h2 className={styles.rotorTitle}>Антиповторитель</h2>

          <div className={styles.antiRepeatScale}>
            <svg
              className={`${styles.rotorArc} ${styles.antiRepeatArc}`}
              viewBox="0 0 230 160"
            >
              <path d="M 160 50 A 70 70 0 0 1 102.2 118.9" />
            </svg>

            {ANTI_REPEAT_TICK_ANGLES.map((tickAngle) => (
              <span
                className={`${styles.rotorTick} ${styles.antiRepeatTick} ${
                  ANTI_REPEAT_OPTIONS.some(
                    (antiRepeatOption) => antiRepeatOption.angle === tickAngle,
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

            {ANTI_REPEAT_OPTIONS.map((antiRepeatOption) => (
              <button
                className={`${styles.rotorIcon} ${styles.antiRepeatOption} ${
                  antiRepeatOption.value === monitorState.selectedAntiRepeatMode
                    ? styles.activeRotorIcon
                    : ''
                }`}
                key={antiRepeatOption.value}
                type="button"
                style={
                  {
                    '--icon-angle': `${antiRepeatOption.angle}deg`,
                    '--icon-offset': `${antiRepeatOption.labelOffset}px`,
                    '--icon-upright-angle': `${-antiRepeatOption.angle}deg`,
                  } as CSSProperties
                }
                onClick={() => selectAntiRepeatMode(antiRepeatOption.value)}
              >
                {antiRepeatOption.label}
              </button>
            ))}

            <button
              className={`${styles.rotorKnob} ${styles.antiRepeatKnob}`}
              type="button"
              style={
                {
                  '--rotor-angle': `${selectedAntiRepeatOption.angle + 90}deg`,
                } as CSSProperties
              }
              onClick={selectNextAntiRepeatMode}
            >
              <span
                className={`${styles.rotorPointer} ${styles.antiRepeatPointer}`}
              />
            </button>
          </div>
        </section>

        <div className={styles.costControl}>
          <ShardCostCounter value={displayedCraftCost} />
        </div>

        <div className={styles.startControl}>
          <button className={styles.startButton} type="button" />
          <p className={styles.startButtonLabel}>Создать украшение</p>
        </div>
      </div>
    </section>
  )
}
