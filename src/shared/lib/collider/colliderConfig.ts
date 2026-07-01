type CraftOptionConfig = {
  readonly content: string
  readonly displayName: string
  readonly costModifier: number
}

export const ANTI_REPEAT_SHARDS_SURCHARGE = 1000

export const ALBUM_VALUES = [
  'random',
  'classic',
  'fairytale',
  'oriental',
  'magic',
] as const

export type AlbumValue = (typeof ALBUM_VALUES)[number]

export const ALBUM_OPTIONS = {
  random: {
    content: '?',
    displayName: 'Случайный',
    costModifier: 0,
  },
  classic: {
    content: '*',
    displayName: 'Новогодняя классика',
    costModifier: 150,
  },
  fairytale: {
    content: 'C',
    displayName: 'Рождественская сказка',
    costModifier: 150,
  },
  oriental: {
    content: '福',
    displayName: 'Восточный календарь',
    costModifier: 150,
  },
  magic: {
    content: '+',
    displayName: 'Зимнее чудо',
    costModifier: 150,
  },
} satisfies Record<AlbumValue, CraftOptionConfig>

export const LEVEL_VALUES = [
  'random',
  'lvl_1',
  'lvl_2',
  'lvl_3',
  'lvl_4',
  'lvl_5',
] as const

export type LevelValue = (typeof LEVEL_VALUES)[number]

export const LEVEL_OPTIONS = {
  random: {
    content: '?',
    displayName: 'Случайный',
    costModifier: 0,
  },
  lvl_1: {
    content: 'I',
    displayName: 'I',
    costModifier: 50,
  },
  lvl_2: {
    content: 'II',
    displayName: 'II',
    costModifier: 100,
  },
  lvl_3: {
    content: 'III',
    displayName: 'III',
    costModifier: 200,
  },
  lvl_4: {
    content: 'IV',
    displayName: 'IV',
    costModifier: 400,
  },
  lvl_5: {
    content: 'V',
    displayName: 'V',
    costModifier: 800,
  },
} satisfies Record<LevelValue, CraftOptionConfig>

export const SPECIFIC_DECORATION_TYPE_VALUES = [
  'top',
  'lights',
  'toys',
  'floor',
] as const

export type SpecificDecorationTypeValue =
  (typeof SPECIFIC_DECORATION_TYPE_VALUES)[number]

export const DECORATION_TYPE_VALUES = [
  'random',
  ...SPECIFIC_DECORATION_TYPE_VALUES,
] as const

export type DecorationTypeValue = (typeof DECORATION_TYPE_VALUES)[number]

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
