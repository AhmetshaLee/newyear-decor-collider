import {
  DECORATION_ALBUM_LABELS,
  DECORATION_ALBUM_SYMBOLS,
  DECORATION_LEVEL_LABELS,
  DECORATION_TYPE_LABELS,
} from '@/entities/decoration'
import {
  ANTI_REPEAT_SHARDS_SURCHARGE,
  type AntiRepeatMode,
  type CraftAlbum,
  type CraftDecorationType,
  type CraftLevel,
} from '@/features/craft-decoration'

type ColliderControlOption = {
  readonly indicator: string
  readonly label: string
}

function createTextControlOption(text: string): ColliderControlOption {
  return {
    indicator: text,
    label: text,
  }
}

const RANDOM_FILTER_OPTION = {
  indicator: '?',
  label: 'Случайный',
} satisfies ColliderControlOption

export const ALBUM_CONTROL_OPTIONS = {
  random: RANDOM_FILTER_OPTION,
  classic: {
    indicator: DECORATION_ALBUM_SYMBOLS.classic,
    label: DECORATION_ALBUM_LABELS.classic,
  },
  fairytale: {
    indicator: DECORATION_ALBUM_SYMBOLS.fairytale,
    label: DECORATION_ALBUM_LABELS.fairytale,
  },
  oriental: {
    indicator: DECORATION_ALBUM_SYMBOLS.oriental,
    label: DECORATION_ALBUM_LABELS.oriental,
  },
  magic: {
    indicator: DECORATION_ALBUM_SYMBOLS.magic,
    label: DECORATION_ALBUM_LABELS.magic,
  },
} satisfies Record<CraftAlbum, ColliderControlOption>

export const LEVEL_CONTROL_OPTIONS = {
  random: RANDOM_FILTER_OPTION,
  lvl_1: createTextControlOption(DECORATION_LEVEL_LABELS.lvl_1),
  lvl_2: createTextControlOption(DECORATION_LEVEL_LABELS.lvl_2),
  lvl_3: createTextControlOption(DECORATION_LEVEL_LABELS.lvl_3),
  lvl_4: createTextControlOption(DECORATION_LEVEL_LABELS.lvl_4),
  lvl_5: createTextControlOption(DECORATION_LEVEL_LABELS.lvl_5),
} satisfies Record<CraftLevel, ColliderControlOption>

export const DECORATION_TYPE_CONTROL_OPTIONS = {
  random: RANDOM_FILTER_OPTION,
  top: {
    indicator: '▲',
    label: DECORATION_TYPE_LABELS.top,
  },
  lights: {
    indicator: '✦',
    label: DECORATION_TYPE_LABELS.lights,
  },
  toys: {
    indicator: '◆',
    label: DECORATION_TYPE_LABELS.toys,
  },
  floor: {
    indicator: '▣',
    label: DECORATION_TYPE_LABELS.floor,
  },
} satisfies Record<CraftDecorationType, ColliderControlOption>

export const ANTI_REPEAT_CONTROL_OPTIONS = {
  off: {
    indicator: 'Выкл',
    label: 'Выключен',
  },
  useShards: {
    indicator: 'Осколки',
    label: `За ${ANTI_REPEAT_SHARDS_SURCHARGE} осколков`,
  },
} satisfies Record<AntiRepeatMode, ColliderControlOption>
