import {
  ALBUM_OPTIONS,
  ANTI_REPEAT_MODE_OPTIONS,
  DECORATION_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  type CraftConfig,
} from './colliderConfig'

const BASE_CRAFT_COST = 100

export function calculateCraftCost(config: CraftConfig) {
  return (
    BASE_CRAFT_COST +
    ALBUM_OPTIONS[config.album].costModifier +
    LEVEL_OPTIONS[config.level].costModifier +
    DECORATION_TYPE_OPTIONS[config.decorationType].costModifier +
    ANTI_REPEAT_MODE_OPTIONS[config.antiRepeatMode].costModifier
  )
}
