import {
  DECORATION_ALBUM_VALUES,
  DECORATION_LEVEL_VALUES,
  DECORATION_TYPE_VALUES,
  type DecorationAlbum,
  type DecorationLevel,
  type DecorationType,
} from '@/entities/decoration'

const RANDOM_CRAFT_FILTER = 'random'

export const CRAFT_ALBUM_VALUES = [
  RANDOM_CRAFT_FILTER,
  ...DECORATION_ALBUM_VALUES,
] as const

export type CraftAlbum = typeof RANDOM_CRAFT_FILTER | DecorationAlbum

export const CRAFT_LEVEL_VALUES = [
  RANDOM_CRAFT_FILTER,
  ...DECORATION_LEVEL_VALUES,
] as const

export type CraftLevel = typeof RANDOM_CRAFT_FILTER | DecorationLevel

export const CRAFT_DECORATION_TYPE_VALUES = [
  RANDOM_CRAFT_FILTER,
  ...DECORATION_TYPE_VALUES,
] as const

export type CraftDecorationType = typeof RANDOM_CRAFT_FILTER | DecorationType

export const ANTI_REPEAT_MODE_VALUES = ['off', 'useShards'] as const

export type AntiRepeatMode = (typeof ANTI_REPEAT_MODE_VALUES)[number]

export type CraftRecipe = {
  album: CraftAlbum
  level: CraftLevel
  decorationType: CraftDecorationType
  antiRepeatMode: AntiRepeatMode
}
