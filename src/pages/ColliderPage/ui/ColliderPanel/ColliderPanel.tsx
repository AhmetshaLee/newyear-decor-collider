import { useState, type ReactNode } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import { RotarySwitch, type RotarySwitchArc } from '../RotarySwitch'

import styles from './ColliderPanel.module.scss'

type AlbumValue = 'random' | 'classic' | 'fairytale' | 'oriental' | 'magic'
type LevelValue = 'random' | 'lvl_1' | 'lvl_2' | 'lvl_3' | 'lvl_4' | 'lvl_5'
type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'
type SpecificDecorationTypeValue = Exclude<DecorationTypeValue, 'random'>
type AntiRepeatMode = 'off' | 'useShards'

type ControlOption<TValue extends string> = {
  value: TValue
  content: ReactNode
  displayName: string
}

type ControlOptions<TValue extends string> = [
  ControlOption<TValue>,
  ...ControlOption<TValue>[],
]

type MonitorState = {
  userShards: number
  decorationProject: string
  selectedAlbum: AlbumValue
  selectedLevel: LevelValue
  selectedType: DecorationTypeValue
  selectedAntiRepeatMode: AntiRepeatMode
}

const ALBUM_OPTIONS = [
  {
    value: 'random',
    content: '?',
    displayName: 'Случайный',
  },
  {
    value: 'classic',
    content: '*',
    displayName: 'Новогодняя классика',
  },
  {
    value: 'fairytale',
    content: 'C',
    displayName: 'Рождественская сказка',
  },
  {
    value: 'oriental',
    content: '福',
    displayName: 'Восточный календарь',
  },
  {
    value: 'magic',
    content: '+',
    displayName: 'Зимнее чудо',
  },
] satisfies ControlOptions<AlbumValue>

const ALBUM_ROTARY_ARC = {
  radius: 66,
  startAngle: -180,
  endAngle: 0,
} satisfies RotarySwitchArc

const LEVEL_OPTIONS = [
  {
    value: 'random',
    content: '?',
    displayName: 'Случайный',
  },
  {
    value: 'lvl_1',
    content: 'I',
    displayName: 'I',
  },
  {
    value: 'lvl_2',
    content: 'II',
    displayName: 'II',
  },
  {
    value: 'lvl_3',
    content: 'III',
    displayName: 'III',
  },
  {
    value: 'lvl_4',
    content: 'IV',
    displayName: 'IV',
  },
  {
    value: 'lvl_5',
    content: 'V',
    displayName: 'V',
  },
] satisfies ControlOptions<LevelValue>

const LEVEL_ROTARY_ARC = {
  radius: 66,
  startAngle: -180,
  endAngle: 0,
} satisfies RotarySwitchArc

const RANDOM_DECORATION_TYPE_OPTION = {
  value: 'random',
  content: '?',
  displayName: 'Случайный',
} satisfies ControlOption<DecorationTypeValue>

const SPECIFIC_DECORATION_TYPE_OPTIONS = [
  { value: 'top', content: '▲', displayName: 'Верхушка' },
  { value: 'lights', content: '✦', displayName: 'Гирлянды' },
  { value: 'toys', content: '◆', displayName: 'Навесные игрушки' },
  { value: 'floor', content: '▣', displayName: 'Нижние игрушки' },
] satisfies ControlOptions<SpecificDecorationTypeValue>

const DECORATION_TYPE_OPTIONS = [
  RANDOM_DECORATION_TYPE_OPTION,
  ...SPECIFIC_DECORATION_TYPE_OPTIONS,
] satisfies ControlOptions<DecorationTypeValue>

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
] satisfies ControlOptions<AntiRepeatMode>

const ANTI_REPEAT_ROTARY_ARC = {
  radius: 66,
  startAngle: 0,
  endAngle: 80,
} satisfies RotarySwitchArc

const DISPLAYED_CRAFT_COST = 120

const INITIAL_MONITOR_STATE: MonitorState = {
  userShards: 10210,
  decorationProject: 'Проект украшения',
  selectedAlbum: 'classic',
  selectedLevel: 'lvl_2',
  selectedType: 'random',
  selectedAntiRepeatMode: 'off',
}

const getSelectedOption = <TValue extends string>(
  options: ControlOptions<TValue>,
  value: TValue,
) => {
  return options.find((option) => option.value === value) ?? options[0]
}

export function ColliderPanel() {
  const [monitorState, setMonitorState] = useState<MonitorState>(
    INITIAL_MONITOR_STATE,
  )

  const selectedAlbumOption = getSelectedOption(
    ALBUM_OPTIONS,
    monitorState.selectedAlbum,
  )
  const selectedLevelOption = getSelectedOption(
    LEVEL_OPTIONS,
    monitorState.selectedLevel,
  )
  const selectedDecorationTypeOption = getSelectedOption(
    DECORATION_TYPE_OPTIONS,
    monitorState.selectedType,
  )
  const selectedAntiRepeatOption = getSelectedOption(
    ANTI_REPEAT_OPTIONS,
    monitorState.selectedAntiRepeatMode,
  )

  const selectAlbum = (albumValue: AlbumValue) => {
    setMonitorState((currentState) => ({
      ...currentState,
      selectedAlbum: albumValue,
    }))
  }

  const selectLevel = (levelValue: LevelValue) => {
    setMonitorState((currentState) => ({
      ...currentState,
      selectedLevel: levelValue,
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
            levelName={selectedLevelOption.displayName}
            albumName={selectedAlbumOption.displayName}
            decorationTypeName={selectedDecorationTypeOption.displayName}
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

        <section className={`${styles.rotorPanel} ${styles.levelPanel}`}>
          <ControlLabel className={styles.rotorLabel}>Уровень</ControlLabel>

          <RotarySwitch
            arc={LEVEL_ROTARY_ARC}
            className={styles.levelRotorAnchor}
            items={LEVEL_OPTIONS}
            value={monitorState.selectedLevel}
            onValueChange={selectLevel}
          />
        </section>

        <div className={styles.typeSlot}>
          <section className={styles.typePanel}>
            <div className={styles.typeControl}>
              <ControlLabel>Случайный</ControlLabel>
              <DecorationTypeButtonGroup>
                <DecorationTypeButton
                  isSelected={
                    monitorState.selectedType ===
                    RANDOM_DECORATION_TYPE_OPTION.value
                  }
                  onClick={() => selectType(RANDOM_DECORATION_TYPE_OPTION.value)}
                >
                  {RANDOM_DECORATION_TYPE_OPTION.content}
                </DecorationTypeButton>
              </DecorationTypeButtonGroup>
            </div>

            <div className={styles.typeControl}>
              <ControlLabel>Тип украшения</ControlLabel>
              <DecorationTypeButtonGroup>
                {SPECIFIC_DECORATION_TYPE_OPTIONS.map((typeOption) => {
                  const isSelected =
                    monitorState.selectedType === typeOption.value

                  return (
                    <DecorationTypeButton
                      isSelected={isSelected}
                      key={typeOption.value}
                      onClick={() => selectType(typeOption.value)}
                    >
                      {typeOption.content}
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
          <CraftCost value={DISPLAYED_CRAFT_COST} />
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
