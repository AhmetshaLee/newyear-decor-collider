export {
  DECORATIONS_REGISTRY,
  getDecorationById,
} from './model/decorationsRegistry'
export type { Decoration } from './model/decorationsRegistry'

export { calculateDecorationValue } from './model/decorationEconomy'

export {
  DECORATION_ALBUM_LABELS,
  DECORATION_ALBUM_SYMBOLS,
  DECORATION_ALBUM_VALUES,
  DECORATION_LEVEL_LABELS,
  DECORATION_LEVEL_VALUES,
  DECORATION_TYPE_LABELS,
  DECORATION_TYPE_VALUES,
} from './model/decorationValues'
export type {
  DecorationAlbum,
  DecorationLevel,
  DecorationType,
} from './model/decorationValues'

export { DecorationSlot } from './ui/DecorationSlot'
export { DecorationVisual } from './ui/DecorationVisual'
