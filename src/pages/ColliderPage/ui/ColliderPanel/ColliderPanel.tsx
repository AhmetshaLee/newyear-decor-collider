import { useState } from 'react'
import { ControlLabel } from '../ControlLabel'
import { StatusMonitor } from '../StatusMonitor'
import { MonitorControlButton } from '../MonitorControlButton'
import { DecorationTypeButton } from '../DecorationTypeButton'
import { DecorationTypeButtonGroup } from '../DecorationTypeButtonGroup'
import { CraftButton } from '../CraftButton'
import { CraftCost } from '../CraftCost'
import { CraftRewardDialog } from '../CraftRewardDialog'
import { RotarySwitch, type RotarySwitchArc } from '../RotarySwitch'
import {
  ANTI_REPEAT_MODE_VALUES,
  CRAFT_ALBUM_VALUES,
  CRAFT_LEVEL_VALUES,
  calculateCraftCost,
  type AntiRepeatMode,
  type CraftAlbum,
  type CraftDecorationType,
  type CraftLevel,
  type CraftRecipe,
  useCraftDecoration,
} from '@/features/craft-decoration'
import { DECORATION_TYPE_VALUES, type Decoration } from '@/entities/decoration'
import { usePlayerProgress } from '@/entities/player-progress'
import { useNotification } from '@/shared/ui/Notification'
import {
  ALBUM_CONTROL_OPTIONS,
  ANTI_REPEAT_CONTROL_OPTIONS,
  DECORATION_TYPE_CONTROL_OPTIONS,
  LEVEL_CONTROL_OPTIONS,
} from './colliderControlOptions'

import styles from './ColliderPanel.module.scss'

type ColliderPanelProps = {
  onOpenInventory: () => void
  onOpenCollection: () => void
}

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

const INITIAL_CRAFT_RECIPE: CraftRecipe = {
  album: 'random',
  level: 'random',
  decorationType: 'random',
  antiRepeatMode: 'off',
}

export function ColliderPanel({
  onOpenCollection,
  onOpenInventory,
}: ColliderPanelProps) {
  const { progress } = usePlayerProgress()
  const { createDecoration } = useCraftDecoration()
  const { notify } = useNotification()
  const [recipe, setRecipe] = useState<CraftRecipe>(INITIAL_CRAFT_RECIPE)
  const [craftedDecoration, setCraftedDecoration] = useState<Decoration | null>(
    null,
  )

  const userShards = progress.userShards
  const craftPrice = calculateCraftCost(recipe)
  const canCreateDecoration = userShards >= craftPrice
  const isCraftResultVisible = craftedDecoration !== null

  const handleCreateDecoration = () => {
    const result = createDecoration(recipe)

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

  const selectAlbum = (album: CraftAlbum) => {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      album,
    }))
  }

  const selectLevel = (level: CraftLevel) => {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      level,
    }))
  }

  const selectType = (decorationType: CraftDecorationType) => {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      decorationType,
    }))
  }

  const selectAntiRepeatMode = (antiRepeatMode: AntiRepeatMode) => {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      antiRepeatMode,
    }))
  }

  return (
    <section className={styles.panel}>
      <div aria-hidden="true" className={styles.panelSurface} />

      <div className={styles.panelGrid}>
        <div className={styles.monitorSlot}>
          <StatusMonitor
            availableShards={userShards}
            projectTitle={DECORATION_PROJECT_TITLE}
            levelLabel={LEVEL_CONTROL_OPTIONS[recipe.level].label}
            albumLabel={ALBUM_CONTROL_OPTIONS[recipe.album].label}
            decorationTypeLabel={
              DECORATION_TYPE_CONTROL_OPTIONS[recipe.decorationType].label
            }
            antiRepeatModeLabel={
              ANTI_REPEAT_CONTROL_OPTIONS[recipe.antiRepeatMode].label
            }
            controls={
              <>
                <MonitorControlButton
                  ariaLabel="Открыть инвентарь"
                  onClick={onOpenInventory}
                >
                  I
                </MonitorControlButton>
                <MonitorControlButton
                  ariaLabel="Открыть книгу коллекций"
                  onClick={onOpenCollection}
                >
                  C
                </MonitorControlButton>
              </>
            }
            footerLabel="Коллайдер"
          />
        </div>

        <section className={`${styles.rotaryPanel} ${styles.albumSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Альбом</ControlLabel>

          <RotarySwitch
            arc={ALBUM_ROTARY_ARC}
            className={styles.albumRotorAnchor}
            isDisabled={isCraftResultVisible}
            values={CRAFT_ALBUM_VALUES}
            value={recipe.album}
            onValueChange={selectAlbum}
            renderValue={(album) => ALBUM_CONTROL_OPTIONS[album].indicator}
          />
        </section>

        <section className={`${styles.rotaryPanel} ${styles.levelSlot}`}>
          <ControlLabel className={styles.rotorLabel}>Уровень</ControlLabel>

          <RotarySwitch
            arc={LEVEL_ROTARY_ARC}
            className={styles.levelRotorAnchor}
            isDisabled={isCraftResultVisible}
            values={CRAFT_LEVEL_VALUES}
            value={recipe.level}
            onValueChange={selectLevel}
            renderValue={(level) => LEVEL_CONTROL_OPTIONS[level].indicator}
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
            value={recipe.antiRepeatMode}
            onValueChange={selectAntiRepeatMode}
            renderValue={(antiRepeatMode) =>
              ANTI_REPEAT_CONTROL_OPTIONS[antiRepeatMode].indicator
            }
          />
        </section>

        <div className={styles.typeSlot}>
          <div className={`${styles.typeControl} ${styles.randomTypeControl}`}>
            <ControlLabel>Случайный</ControlLabel>
            <DecorationTypeButtonGroup>
              <DecorationTypeButton
                isDisabled={isCraftResultVisible}
                isSelected={recipe.decorationType === 'random'}
                onClick={() => selectType('random')}
              >
                {DECORATION_TYPE_CONTROL_OPTIONS.random.indicator}
              </DecorationTypeButton>
            </DecorationTypeButtonGroup>
          </div>

          <div className={styles.typeControl}>
            <ControlLabel>Тип украшения</ControlLabel>
            <DecorationTypeButtonGroup>
              {DECORATION_TYPE_VALUES.map((decorationType) => {
                const isSelected = recipe.decorationType === decorationType

                return (
                  <DecorationTypeButton
                    isDisabled={isCraftResultVisible}
                    isSelected={isSelected}
                    key={decorationType}
                    onClick={() => selectType(decorationType)}
                  >
                    {DECORATION_TYPE_CONTROL_OPTIONS[decorationType].indicator}
                  </DecorationTypeButton>
                )
              })}
            </DecorationTypeButtonGroup>
          </div>
        </div>

        <div className={styles.craftSlot}>
          <div className={styles.costControl}>
            <CraftCost value={craftPrice} />
            <ControlLabel>Стоимость</ControlLabel>
          </div>

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
