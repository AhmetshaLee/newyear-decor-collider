import type {
  DecorationAlbum,
  DecorationLevel,
  DecorationType,
} from './decorationValues'

export type Decoration = {
  id: string
  album: DecorationAlbum
  level: DecorationLevel
  type: DecorationType
  name: string
  description: string
}

export const DECORATION_ALBUM_LABELS = {
  classic: 'Новогодняя классика',
  fairytale: 'Рождественская сказка',
  oriental: 'Восточный календарь',
  magic: 'Зимнее чудо / Магия',
} satisfies Record<DecorationAlbum, string>

export const DECORATIONS_REGISTRY = [
  // TODO: заполнить реальными украшениями после утверждения списка
] satisfies readonly Decoration[]
