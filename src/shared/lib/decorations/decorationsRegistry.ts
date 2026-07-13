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
  {
    id: 'classic-lvl-3-pine-lights',
    album: 'classic',
    level: 'lvl_3',
    type: 'lights',
    name: 'Сосновая гирлянда',
    description: 'Теплая гирлянда с зелеными лампами и запахом хвои.',
  },
  {
    id: 'classic-lvl-4-silver-train',
    album: 'classic',
    level: 'lvl_4',
    type: 'floor',
    name: 'Серебряный поезд',
    description: 'Миниатюрный поезд с матовыми вагонами для основания елки.',
  },
  {
    id: 'fairytale-lvl-1-star-top',
    album: 'fairytale',
    level: 'lvl_1',
    type: 'top',
    name: 'Звезда сказочника',
    description: 'Бумажная звезда, будто вырезанная из старой зимней книги.',
  },
  {
    id: 'fairytale-lvl-2-firefly-lights',
    album: 'fairytale',
    level: 'lvl_2',
    type: 'lights',
    name: 'Огоньки светлячков',
    description: 'Нить маленьких огней, освещающих лесную тропу.',
  },
  {
    id: 'fairytale-lvl-3-gingerbread-fox',
    album: 'fairytale',
    level: 'lvl_3',
    type: 'toys',
    name: 'Пряничная лиса',
    description: 'Рыжая игрушка с глазурью и крошечной серебряной пуговицей.',
  },
  {
    id: 'fairytale-lvl-5-woodland-cabin',
    album: 'fairytale',
    level: 'lvl_5',
    type: 'floor',
    name: 'Домик лесника',
    description: 'Светящийся домик с заснеженной крышей для нижней ветки.',
  },
  {
    id: 'oriental-lvl-1-lantern-top',
    album: 'oriental',
    level: 'lvl_1',
    type: 'top',
    name: 'Фонарь удачи',
    description: 'Красный бумажный фонарь с золотой кистью.',
  },
  {
    id: 'oriental-lvl-2-jade-lights',
    album: 'oriental',
    level: 'lvl_2',
    type: 'lights',
    name: 'Нефритовые огоньки',
    description: 'Холодные зеленые огни, собранные в тонкую цепочку.',
  },
  {
    id: 'oriental-lvl-4-koi-fish',
    album: 'oriental',
    level: 'lvl_4',
    type: 'toys',
    name: 'Золотой карп',
    description: 'Подвеска в форме карпа кои, обещающая спокойный год.',
  },
  {
    id: 'oriental-lvl-5-tea-pavilion',
    album: 'oriental',
    level: 'lvl_5',
    type: 'floor',
    name: 'Чайный павильон',
    description: 'Небольшой павильон с красной крышей и золотыми окнами.',
  },
  {
    id: 'magic-lvl-1-moon-top',
    album: 'magic',
    level: 'lvl_1',
    type: 'top',
    name: 'Лунный шпиль',
    description: 'Тонкий серебряный шпиль, поймавший отблеск зимней луны.',
  },
  {
    id: 'magic-lvl-3-northern-lights',
    album: 'magic',
    level: 'lvl_3',
    type: 'lights',
    name: 'Северное сияние',
    description: 'Переливающаяся гирлянда с холодным синим светом.',
  },
  {
    id: 'magic-lvl-4-crystal-owl',
    album: 'magic',
    level: 'lvl_4',
    type: 'toys',
    name: 'Хрустальная сова',
    description: 'Прозрачная сова с гранеными крыльями и белым свечением.',
  },
  {
    id: 'magic-lvl-5-snow-globe',
    album: 'magic',
    level: 'lvl_5',
    type: 'floor',
    name: 'Сфера метели',
    description: 'Большая снежная сфера, в которой кружится маленькая вьюга.',
  },
] satisfies readonly Decoration[]
