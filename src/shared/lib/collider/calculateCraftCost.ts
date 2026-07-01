export type AlbumValue =
  | 'random'
  | 'classic'
  | 'fairytale'
  | 'oriental'
  | 'magic'
export type LevelValue =
  | 'random'
  | 'lvl_1'
  | 'lvl_2'
  | 'lvl_3'
  | 'lvl_4'
  | 'lvl_5'
export type DecorationTypeValue = 'random' | 'top' | 'lights' | 'toys' | 'floor'
export type AntiRepeatMode = 'off' | 'useShards'

export type CraftConfig = {
  album: AlbumValue
  level: LevelValue
  decorationType: DecorationTypeValue
  antiRepeatMode: AntiRepeatMode
}

export const ANTI_REPEAT_SHARDS_SURCHARGE = 1000
const BASE_CRAFT_COST = 100

const ALBUM_COST_MODIFIERS: Record<AlbumValue, number> = {
  random: 0,
  classic: 150,
  fairytale: 150,
  oriental: 150,
  magic: 150,
}

const LEVEL_COST_MODIFIERS: Record<LevelValue, number> = {
  random: 0,
  lvl_1: 50,
  lvl_2: 100,
  lvl_3: 200,
  lvl_4: 400,
  lvl_5: 800,
}

const DECORATION_TYPE_COST_MODIFIERS: Record<DecorationTypeValue, number> = {
  random: 0,
  top: 250,
  lights: 250,
  toys: 250,
  floor: 250,
}

const ANTI_REPEAT_COST_MODIFIERS: Record<AntiRepeatMode, number> = {
  off: 0,
  useShards: ANTI_REPEAT_SHARDS_SURCHARGE,
}

export function calculateCraftCost(config: CraftConfig) {
  return (
    BASE_CRAFT_COST +
    ALBUM_COST_MODIFIERS[config.album] +
    LEVEL_COST_MODIFIERS[config.level] +
    DECORATION_TYPE_COST_MODIFIERS[config.decorationType] +
    ANTI_REPEAT_COST_MODIFIERS[config.antiRepeatMode]
  )
}
