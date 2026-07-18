import {
  DECORATION_ALBUM_SYMBOLS,
  DECORATION_ALBUM_VALUES,
  DECORATION_LEVEL_LABELS,
  DECORATION_LEVEL_VALUES,
  DECORATION_TYPE_VALUES as SPECIFIC_DECORATION_TYPE_VALUES,
  type DecorationAlbum,
  type DecorationLevel,
  type DecorationType as SpecificDecorationTypeValue,
} from '@/shared/lib/decorations'

type CraftOptionConfig = {
  readonly content: string
  readonly displayName: string
  readonly costModifier: number
}

export const ANTI_REPEAT_SHARDS_SURCHARGE = 1000

export const ALBUM_VALUES = ['random', ...DECORATION_ALBUM_VALUES] as const

export type AlbumValue = 'random' | DecorationAlbum

export const ALBUM_OPTIONS = {
  random: {
    content: '?',
    displayName: 'Случайный',
    costModifier: 0,
  },
  classic: {
    content: DECORATION_ALBUM_SYMBOLS.classic,
    displayName: 'Новогодняя классика',
    costModifier: 150,
  },
  fairytale: {
    content: DECORATION_ALBUM_SYMBOLS.fairytale,
    displayName: 'Рождественская сказка',
    costModifier: 150,
  },
  oriental: {
    content: DECORATION_ALBUM_SYMBOLS.oriental,
    displayName: 'Восточный календарь',
    costModifier: 150,
  },
  magic: {
    content: DECORATION_ALBUM_SYMBOLS.magic,
    displayName: 'Зимнее чудо',
    costModifier: 150,
  },
} satisfies Record<AlbumValue, CraftOptionConfig>

export const LEVEL_VALUES = ['random', ...DECORATION_LEVEL_VALUES] as const

export type LevelValue = 'random' | DecorationLevel

export const LEVEL_OPTIONS = {
  random: {
    content: '?',
    displayName: 'Случайный',
    costModifier: 0,
  },
  lvl_1: {
    content: DECORATION_LEVEL_LABELS.lvl_1,
    displayName: 'I',
    costModifier: 50,
  },
  lvl_2: {
    content: DECORATION_LEVEL_LABELS.lvl_2,
    displayName: 'II',
    costModifier: 100,
  },
  lvl_3: {
    content: DECORATION_LEVEL_LABELS.lvl_3,
    displayName: 'III',
    costModifier: 200,
  },
  lvl_4: {
    content: DECORATION_LEVEL_LABELS.lvl_4,
    displayName: 'IV',
    costModifier: 400,
  },
  lvl_5: {
    content: DECORATION_LEVEL_LABELS.lvl_5,
    displayName: 'V',
    costModifier: 800,
  },
} satisfies Record<LevelValue, CraftOptionConfig>

export const DECORATION_TYPE_VALUES = [
  'random',
  ...SPECIFIC_DECORATION_TYPE_VALUES,
] as const

export type DecorationTypeValue = 'random' | SpecificDecorationTypeValue

export const DECORATION_TYPE_OPTIONS = {
  random: {
    content: '?',
    displayName: 'Случайный',
    costModifier: 0,
  },
  top: {
    content: '▲',
    displayName: 'Верхушка',
    costModifier: 250,
  },
  lights: {
    content: '✦',
    displayName: 'Гирлянды',
    costModifier: 250,
  },
  toys: {
    content: '◆',
    displayName: 'Навесные игрушки',
    costModifier: 250,
  },
  floor: {
    content: '▣',
    displayName: 'Нижние игрушки',
    costModifier: 250,
  },
} satisfies Record<DecorationTypeValue, CraftOptionConfig>

export const ANTI_REPEAT_MODE_VALUES = ['off', 'useShards'] as const

export type AntiRepeatMode = (typeof ANTI_REPEAT_MODE_VALUES)[number]

export const ANTI_REPEAT_MODE_OPTIONS = {
  off: {
    content: 'Выкл',
    displayName: 'Выключен',
    costModifier: 0,
  },
  useShards: {
    content: 'Осколки',
    displayName: `За ${ANTI_REPEAT_SHARDS_SURCHARGE} осколков`,
    costModifier: ANTI_REPEAT_SHARDS_SURCHARGE,
  },
} satisfies Record<AntiRepeatMode, CraftOptionConfig>

export type CraftConfig = {
  album: AlbumValue
  level: LevelValue
  decorationType: DecorationTypeValue
  antiRepeatMode: AntiRepeatMode
}
