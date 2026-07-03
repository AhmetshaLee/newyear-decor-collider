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
  {
    id: 'classic-lvl-1-glass-snowflake',
    album: 'classic',
    level: 'lvl_1',
    type: 'toys',
    name: 'Стеклянная снежинка',
    description: 'Легкая прозрачная игрушка с тонкими серебристыми гранями.',
  },
  {
    id: 'classic-lvl-2-candy-cane-top',
    album: 'classic',
    level: 'lvl_2',
    type: 'top',
    name: 'Карамельная верхушка',
    description: 'Полосатая елочная верхушка в форме праздничного леденца.',
  },
] satisfies readonly Decoration[]
