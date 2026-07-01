import { useState } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import { RotarySwitch, type RotarySwitchArc } from '../RotarySwitch'
import {
  ALBUM_OPTIONS,
  ALBUM_VALUES,
  ANTI_REPEAT_MODE_OPTIONS,
  ANTI_REPEAT_MODE_VALUES,
  DECORATION_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  LEVEL_VALUES,
  SPECIFIC_DECORATION_TYPE_VALUES,
  type AlbumValue,
  type AntiRepeatMode,
  type CraftConfig,
  type DecorationTypeValue,
  type LevelValue,
} from '@/shared/lib/collider/colliderConfig'
import { calculateCraftCost } from '@/shared/lib/collider/calculateCraftCost'

import styles from './ColliderPanel.module.scss'

const ALBUM_ROTARY_ARC = {
  radius: 66,
  startAngle: -180,
  endAngle: 0,
} satisfies RotarySwitchArc

const LEVEL_ROTARY_ARC = {
  radius: 66,
  startAngle: -180,
  endAngle: 0,
} satisfies RotarySwitchArc

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

export function ColliderPanel() {
  const [config, setConfig] = useState<CraftConfig>(INITIAL_CRAFT_CONFIG)
  const [userShards, setUserShards] = useState(INITIAL_USER_SHARDS)

  const craftPrice = calculateCraftCost(config)

  const canCreateDecoration = userShards >= craftPrice

  const createDecoration = () => {
    setUserShards((currentShards) => {
      return currentShards < craftPrice
        ? currentShards
        : currentShards - craftPrice
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
            levelName={LEVEL_OPTIONS[config.level].displayName}
            albumName={ALBUM_OPTIONS[config.album].displayName}
            decorationTypeName={
              DECORATION_TYPE_OPTIONS[config.decorationType].displayName
            }
            antiRepeatModeName={
              ANTI_REPEAT_MODE_OPTIONS[config.antiRepeatMode].displayName
            }
          />
        </div>
        <section className={`${styles.rotaryPanel} ${styles.albumSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Альбом</ControlLabel>

          <RotarySwitch
            arc={ALBUM_ROTARY_ARC}
            className={styles.albumRotorAnchor}
            values={ALBUM_VALUES}
            value={config.album}
            onValueChange={selectAlbum}
            renderValue={(albumValue) => ALBUM_OPTIONS[albumValue].content}
          />
        </section>

        <section className={`${styles.rotaryPanel} ${styles.levelSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Уровень</ControlLabel>

          <RotarySwitch
            arc={LEVEL_ROTARY_ARC}
            className={styles.levelRotorAnchor}
            values={LEVEL_VALUES}
            value={config.level}
            onValueChange={selectLevel}
            renderValue={(levelValue) => LEVEL_OPTIONS[levelValue].content}
          />
        </section>

        <section className={`${styles.rotaryPanel} ${styles.antiRepeatSlot}`}>
          <ControlLabel className={styles.rotorLabel}>
            Антиповторитель
          </ControlLabel>

          <RotarySwitch
            arc={ANTI_REPEAT_ROTARY_ARC}
            className={styles.antiRepeatRotorAnchor}
            values={ANTI_REPEAT_MODE_VALUES}
            value={config.antiRepeatMode}
            onValueChange={selectAntiRepeatMode}
            renderValue={(antiRepeatMode) =>
              ANTI_REPEAT_MODE_OPTIONS[antiRepeatMode].content
            }
          />
        </section>

        <div className={styles.typeSlot}>
          <section className={styles.typePanel}>
            <div className={styles.typeControl}>
              <ControlLabel>Случайный</ControlLabel>
              <DecorationTypeButtonGroup>
                <DecorationTypeButton
                  isSelected={config.decorationType === 'random'}
                  onClick={() => selectType('random')}
                >
                  {DECORATION_TYPE_OPTIONS.random.content}
                </DecorationTypeButton>
              </DecorationTypeButtonGroup>
            </div>

            <div className={styles.typeControl}>
              <ControlLabel>Тип украшения</ControlLabel>
              <DecorationTypeButtonGroup>
                {SPECIFIC_DECORATION_TYPE_VALUES.map((decorationType) => {
                  const isSelected = config.decorationType === decorationType

                  return (
                    <DecorationTypeButton
                      isSelected={isSelected}
                      key={decorationType}
                      onClick={() => selectType(decorationType)}
                    >
                      {DECORATION_TYPE_OPTIONS[decorationType].content}
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
