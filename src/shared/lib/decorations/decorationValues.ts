export const DECORATION_ALBUM_VALUES = [
  'classic',
  'fairytale',
  'oriental',
  'magic',
] as const

export type DecorationAlbum = (typeof DECORATION_ALBUM_VALUES)[number]

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
