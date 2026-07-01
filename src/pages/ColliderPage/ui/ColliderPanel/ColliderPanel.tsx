import { useState, type ReactNode } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import { RotarySwitch, type RotarySwitchArc } from '../RotarySwitch'
import {
  ANTI_REPEAT_SHARDS_SURCHARGE,
  calculateCraftCost,
  type AlbumValue,
  type AntiRepeatMode,
  type CraftConfig,
  type DecorationTypeValue,
  type LevelValue,
} from '@/shared/lib/collider/calculateCraftCost'

import styles from './ColliderPanel.module.scss'

type SpecificDecorationTypeValue = Exclude<DecorationTypeValue, 'random'>

type ControlOption<TValue extends string> = {
  value: TValue
  content: ReactNode
  displayName: string
}

type ControlOptions<TValue extends string> = [
  ControlOption<TValue>,
  ...ControlOption<TValue>[],
]

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
  {
    value: 'lights',
    content: '✦',
    displayName: 'Гирлянды',
  },
  {
    value: 'toys',
    content: '◆',
    displayName: 'Навесные игрушки',
  },
  {
    value: 'floor',
    content: '▣',
    displayName: 'Нижние игрушки',
  },
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
    displayName: `За ${ANTI_REPEAT_SHARDS_SURCHARGE} осколков`,
  },
] satisfies ControlOptions<AntiRepeatMode>

const ANTI_REPEAT_ROTARY_ARC = {
  radius: 66,
  startAngle: 0,
  endAngle: 80,
} satisfies RotarySwitchArc

const DECORATION_PROJECT_TITLE = 'Проект украшения'
const INITIAL_USER_SHARDS = 150

const INITIAL_CRAFT_CONFIG: CraftConfig = {
  album: 'classic',
  level: 'lvl_2',
  decorationType: 'random',
  antiRepeatMode: 'off',
}

const getSelectedOption = <TValue extends string>(
  options: ControlOptions<TValue>,
  value: TValue,
) => {
  return options.find((option) => option.value === value) ?? options[0]
}

export function ColliderPanel() {
  const [config, setConfig] = useState<CraftConfig>(INITIAL_CRAFT_CONFIG)
  const [userShards, setUserShards] = useState(INITIAL_USER_SHARDS)

  const selectedAlbumOption = getSelectedOption(
    ALBUM_OPTIONS,
    config.album,
  )

  const selectedLevelOption = getSelectedOption(
    LEVEL_OPTIONS,
    config.level,
  )

  const selectedDecorationTypeOption = getSelectedOption(
    DECORATION_TYPE_OPTIONS,
    config.decorationType,
  )

  const selectedAntiRepeatOption = getSelectedOption(
    ANTI_REPEAT_OPTIONS,
    config.antiRepeatMode,
  )

  const craftPrice = calculateCraftCost(config)

  const canCreateDecoration = userShards >= craftPrice

  const createDecoration = () => {
    setUserShards((currentShards) => {
      if (currentShards < craftPrice) {
        return currentShards
      }

      return currentShards - craftPrice
    })
  }

  const selectAlbum = (albumValue: AlbumValue) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      album: albumValue,
    }))
  }

  const selectLevel = (levelValue: LevelValue) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      level: levelValue,
    }))
  }

  const selectType = (decorationType: DecorationTypeValue) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      decorationType,
    }))
  }

  const selectAntiRepeatMode = (antiRepeatMode: AntiRepeatMode) => {
    setConfig((currentConfig) => ({
      ...currentConfig,
      antiRepeatMode,
    }))
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelGrid}>
        <div className={styles.monitorSlot}>
          <StatusMonitor
            availableShards={userShards}
            projectTitle={DECORATION_PROJECT_TITLE}
            levelName={selectedLevelOption.displayName}
            albumName={selectedAlbumOption.displayName}
            decorationTypeName={selectedDecorationTypeOption.displayName}
            antiRepeatModeName={selectedAntiRepeatOption.displayName}
          />
        </div>
        <section className={`${styles.rotaryPanel} ${styles.albumSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Альбом</ControlLabel>

          <RotarySwitch
            arc={ALBUM_ROTARY_ARC}
            className={styles.albumRotorAnchor}
            items={ALBUM_OPTIONS}
            value={config.album}
            onValueChange={selectAlbum}
          />
        </section>

        <section className={`${styles.rotaryPanel} ${styles.levelSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Уровень</ControlLabel>

          <RotarySwitch
            arc={LEVEL_ROTARY_ARC}
            className={styles.levelRotorAnchor}
            items={LEVEL_OPTIONS}
            value={config.level}
            onValueChange={selectLevel}
          />
        </section>

        <section className={`${styles.rotaryPanel} ${styles.antiRepeatSlot}`}>
          <ControlLabel className={styles.rotorLabel}>
            Антиповторитель
          </ControlLabel>

          <RotarySwitch
            arc={ANTI_REPEAT_ROTARY_ARC}
            className={styles.antiRepeatRotorAnchor}
            items={ANTI_REPEAT_OPTIONS}
            value={config.antiRepeatMode}
            onValueChange={selectAntiRepeatMode}
          />
        </section>

        <div className={styles.typeSlot}>
          <section className={styles.typePanel}>
            <div className={styles.typeControl}>
              <ControlLabel>Случайный</ControlLabel>
              <DecorationTypeButtonGroup>
                <DecorationTypeButton
                  isSelected={
                    config.decorationType ===
                    RANDOM_DECORATION_TYPE_OPTION.value
                  }
                  onClick={() =>
                    selectType(RANDOM_DECORATION_TYPE_OPTION.value)
                  }
                >
                  {RANDOM_DECORATION_TYPE_OPTION.content}
                </DecorationTypeButton>
              </DecorationTypeButtonGroup>
            </div>

            <div className={styles.typeControl}>
              <ControlLabel>Тип украшения</ControlLabel>
              <DecorationTypeButtonGroup>
                {SPECIFIC_DECORATION_TYPE_OPTIONS.map((typeOption) => {
                  const isSelected = config.decorationType === typeOption.value

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

        <div className={styles.costSlot}>
          <div className={styles.costControl}>
            <CraftCost value={craftPrice} />
            <ControlLabel>Стоимость</ControlLabel>
          </div>
        </div>

        <div className={styles.startSlot}>
          <div className={styles.startControl}>
            <CraftButton
              isDisabled={!canCreateDecoration}
              onClick={createDecoration}
            />
            <ControlLabel>Создать украшение</ControlLabel>
          </div>
        </div>
      </div>
    </section>
  )
}
