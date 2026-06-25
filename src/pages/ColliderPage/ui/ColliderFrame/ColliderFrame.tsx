import { useState } from 'react'
import { ColliderMonitor } from '../ColliderMonitor'
import { ColliderControlLabel } from '../ColliderControlLabel'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftStartButton } from '../CraftStartButton'
import { ShardCostCounter } from '../ShardCostCounter'
import {
  RotorAnchorSwitch,
  type RotorAnchorSwitchArc,
  type RotorAnchorSwitchItem,
} from '../RotorAnchorSwitch'

import styles from './ColliderFrame.module.scss'

type AlbumValue = 'random' | 'classic' | 'fairytale' | 'oriental' | 'magic'
type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'
type AntiRepeatMode = 'off' | 'useShards'
type AlbumOption = RotorAnchorSwitchItem<AlbumValue> & {
  label: string
}

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

type AntiRepeatOption = RotorAnchorSwitchItem<AntiRepeatMode> & {
  displayName: string
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

const ALBUM_OPTIONS = [
  {
    value: 'random',
    content: '?',
    label: 'Случайный',
  },
  {
    value: 'classic',
    content: '*',
    label: 'Новогодняя классика',
  },
  {
    value: 'fairytale',
    content: 'C',
    label: 'Рождественская сказка',
  },
  {
    value: 'oriental',
    content: '福',
    label: 'Восточный календарь',
  },
  {
    value: 'magic',
    content: '+',
    label: 'Зимнее чудо',
  },
] satisfies AlbumOption[]

const ALBUM_ROTARY_ARC = {
  radius: 66,
  startAngle: -180,
  endAngle: 0,
} satisfies RotorAnchorSwitchArc

const ANTI_REPEAT_OPTIONS = [
  {
    value: 'off',
    content: 'Выкл',
    displayName: 'Выключен',
  },
  {
    value: 'useShards',
    content: 'Осколки',
    displayName: 'За осколки',
  },
] satisfies AntiRepeatOption[]

const ANTI_REPEAT_ROTARY_ARC = {
  radius: 66,
  startAngle: 0,
  endAngle: 80,
} satisfies RotorAnchorSwitchArc

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

  return (
    <section className={styles.frame}>
      <div className={styles.panelGrid}>
        <div className={styles.monitorSlot}>
          <ColliderMonitor
            availableShards={monitorState.userShards}
            projectTitle={monitorState.decorationProject}
            levelName={monitorState.selectedLevel}
            albumName={selectedAlbumOption.label}
            decorationTypeName={TYPE_DISPLAY_NAME[monitorState.selectedType]}
            antiRepeatModeName={selectedAntiRepeatOption.displayName}
          />
        </div>
        <section className={styles.rotorPanel}>
          <ColliderControlLabel className={styles.rotorLabel}>
            Альбом
          </ColliderControlLabel>

          <RotorAnchorSwitch
            arc={ALBUM_ROTARY_ARC}
            className={styles.albumRotorAnchor}
            items={ALBUM_OPTIONS}
            value={monitorState.selectedAlbum}
            onValueChange={selectAlbum}
          />
        </section>

        <div className={styles.typeSlot}>
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
        </div>

        <section className={`${styles.rotorPanel} ${styles.antiRepeatPanel}`}>
          <ColliderControlLabel className={styles.rotorLabel}>
            Антиповторитель
          </ColliderControlLabel>

          <RotorAnchorSwitch
            arc={ANTI_REPEAT_ROTARY_ARC}
            className={styles.antiRepeatRotorAnchor}
            items={ANTI_REPEAT_OPTIONS}
            value={monitorState.selectedAntiRepeatMode}
            onValueChange={selectAntiRepeatMode}
          />
        </section>

        <div className={styles.costSlot}>
          <ShardCostCounter value={displayedCraftCost} />
        </div>

        <div className={styles.startSlot}>
          <div className={styles.startControl}>
            <CraftStartButton />
            <ColliderControlLabel>Создать украшение</ColliderControlLabel>
          </div>
        </div>
      </div>
    </section>
  )
}
