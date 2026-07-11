import { useState } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import { CraftRewardDialog } from '../CraftRewardDialog'
import { RotarySwitch, type RotarySwitchArc } from '../RotarySwitch'
import {
  ALBUM_OPTIONS,
  ALBUM_VALUES,
  ANTI_REPEAT_MODE_OPTIONS,
  ANTI_REPEAT_MODE_VALUES,
  DECORATION_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  LEVEL_VALUES,
  type AlbumValue,
  type AntiRepeatMode,
  type CraftConfig,
  type DecorationTypeValue,
  type LevelValue,
  calculateCraftCost,
} from '@/shared/lib/collider'
import {
  DECORATION_TYPE_VALUES as SPECIFIC_DECORATION_TYPE_VALUES,
  type Decoration,
} from '@/shared/lib/decorations'
import { useCraftDecoration } from '@/features/craft-decoration'
import { usePlayerProgress } from '@/entities/player-progress'
import { useNotification } from '@/shared/ui/Notification'

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

const INITIAL_CRAFT_CONFIG: CraftConfig = {
  album: 'random',
  level: 'random',
  decorationType: 'random',
  antiRepeatMode: 'off',
}

export function ColliderPanel() {
  const { progress } = usePlayerProgress()
  const { createDecoration } = useCraftDecoration()
  const { notify } = useNotification()
  const [config, setConfig] = useState<CraftConfig>(INITIAL_CRAFT_CONFIG)
  const [craftedDecoration, setCraftedDecoration] = useState<Decoration | null>(
    null,
  )

  const userShards = progress.userShards
  const craftPrice = calculateCraftCost(config)
  const canCreateDecoration = userShards >= craftPrice
  const isCraftResultVisible = craftedDecoration !== null

  const handleCreateDecoration = () => {
    const result = createDecoration(config)

    if (result.status === 'success') {
      setCraftedDecoration(result.decoration)
      return
    }

    if (result.status === 'notEnoughShards') {
      notify({
        type: 'warning',
        message: 'Недостаточно осколков',
      })
      return
    }

    notify({
      type: 'error',
      message: 'Нет подходящих украшений для текущего рецепта',
    })
  }

  const closeCraftRewardDialog = () => {
    setCraftedDecoration(null)
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
            isDisabled={isCraftResultVisible}
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
            isDisabled={isCraftResultVisible}
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
            isDisabled={isCraftResultVisible}
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
                  isDisabled={isCraftResultVisible}
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
                      isDisabled={isCraftResultVisible}
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
              isDisabled={isCraftResultVisible}
              isUnavailable={!canCreateDecoration}
              onClick={handleCreateDecoration}
            />
            <ControlLabel>Создать украшение</ControlLabel>
          </div>
        </div>
      </div>

      {craftedDecoration !== null && (
        <CraftRewardDialog
          decoration={craftedDecoration}
          onClose={closeCraftRewardDialog}
        />
      )}
    </section>
  )
}
