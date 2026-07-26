export const DECORATION_ALBUM_VALUES = [
  'classic',
  'fairytale',
  'oriental',
  'magic',
] as const

export type DecorationAlbum = (typeof DECORATION_ALBUM_VALUES)[number]

export const DECORATION_ALBUM_LABELS = {
  classic: 'Новогодняя классика',
  fairytale: 'Рождественская сказка',
  oriental: 'Восточный календарь',
  magic: 'Зимнее чудо',
} satisfies Record<DecorationAlbum, string>

export const DECORATION_ALBUM_SYMBOLS = {
  classic: '*',
  fairytale: 'C',
  oriental: '福',
  magic: '+',
} satisfies Record<DecorationAlbum, string>

export const DECORATION_LEVEL_VALUES = [
  'lvl_1',
  'lvl_2',
  'lvl_3',
  'lvl_4',
  'lvl_5',
] as const

export type DecorationLevel = (typeof DECORATION_LEVEL_VALUES)[number]

const DECORATION_VALUE_BY_LEVEL = {
  lvl_1: 150,
  lvl_2: 200,
  lvl_3: 300,
  lvl_4: 500,
  lvl_5: 900,
} satisfies Readonly<Record<DecorationLevel, number>>

const DECORATION_RECYCLE_RATE = 0.5

export function calculateDecorationRecycleValue(level: DecorationLevel) {
  return DECORATION_VALUE_BY_LEVEL[level] * DECORATION_RECYCLE_RATE
}

export const DECORATION_LEVEL_LABELS = {
  lvl_1: 'I',
  lvl_2: 'II',
  lvl_3: 'III',
  lvl_4: 'IV',
  lvl_5: 'V',
} satisfies Record<DecorationLevel, string>

export const DECORATION_TYPE_VALUES = [
  'top',
  'lights',
  'toys',
  'floor',
] as const

export type DecorationType = (typeof DECORATION_TYPE_VALUES)[number]

export const DECORATION_TYPE_LABELS = {
  top: 'Верхушка',
  lights: 'Гирлянды',
  toys: 'Навесные игрушки',
  floor: 'Нижние игрушки',
} satisfies Record<DecorationType, string>
