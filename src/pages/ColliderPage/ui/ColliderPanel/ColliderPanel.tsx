import { useState } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import {
  RotarySwitch,
  type RotarySwitchArc,
  type RotarySwitchItem,
} from '../RotarySwitch'

import styles from './ColliderPanel.module.scss'

type AlbumValue = 'random' | 'classic' | 'fairytale' | 'oriental' | 'magic'
type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'
type AntiRepeatMode = 'off' | 'useShards'
type AlbumOption = RotarySwitchItem<AlbumValue> & {
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

type AntiRepeatOption = RotarySwitchItem<AntiRepeatMode> & {
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
} satisfies RotarySwitchArc

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
} satisfies RotarySwitchArc

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

export function ColliderPanel() {
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
    <section className={styles.panel}>
      <div className={styles.panelGrid}>
        <div className={styles.monitorSlot}>
          <StatusMonitor
            availableShards={monitorState.userShards}
            projectTitle={monitorState.decorationProject}
            levelName={monitorState.selectedLevel}
            albumName={selectedAlbumOption.label}
            decorationTypeName={TYPE_DISPLAY_NAME[monitorState.selectedType]}
            antiRepeatModeName={selectedAntiRepeatOption.displayName}
          />
        </div>
        <section className={styles.rotorPanel}>
          <ControlLabel className={styles.rotorLabel}>Альбом</ControlLabel>

          <RotarySwitch
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
              <ControlLabel>Случайный</ControlLabel>
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
              <ControlLabel>Тип украшения</ControlLabel>
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
          <ControlLabel className={styles.rotorLabel}>
            Антиповторитель
          </ControlLabel>

          <RotarySwitch
            arc={ANTI_REPEAT_ROTARY_ARC}
            className={styles.antiRepeatRotorAnchor}
            items={ANTI_REPEAT_OPTIONS}
            value={monitorState.selectedAntiRepeatMode}
            onValueChange={selectAntiRepeatMode}
          />
        </section>

        <div className={styles.costSlot}>
          <CraftCost value={displayedCraftCost} />
        </div>

        <div className={styles.startSlot}>
          <div className={styles.startControl}>
            <CraftButton />
            <ControlLabel>Создать украшение</ControlLabel>
          </div>
        </div>
      </div>
    </section>
  )
}
