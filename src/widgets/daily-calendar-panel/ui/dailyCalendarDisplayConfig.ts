export type CalendarRewardVisual = 'shards' | 'toy'

export type CalendarRewardPresentation = 'contained' | 'featured'

export type CalendarStickerColor = 'coral' | 'sage' | 'ochre'

export type CalendarDayRewardDisplay = {
  visual: CalendarRewardVisual
  presentation: CalendarRewardPresentation
  badge?: string
  sticker?: CalendarStickerColor
}

export type CalendarDayDisplay = {
  day: number
  reward: CalendarDayRewardDisplay | null
}

type DailyCalendarDisplayConfig = {
  month: string
  weekdays: readonly string[]
  activeDay: number
  previousMonthDays: readonly number[]
  days: readonly CalendarDayDisplay[]
  nextMonthDays: readonly number[]
}

export const DAILY_CALENDAR_DISPLAY_CONFIG = {
  month: '08.2026',
  weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  activeDay: 1,
  previousMonthDays: [],
  days: [
    { day: 1, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 2, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 3, reward: null },
    { day: 4, reward: { visual: 'toy', presentation: 'contained' } },
    {
      day: 5,
      reward: {
        visual: 'toy',
        presentation: 'featured',
        badge: '5',
        sticker: 'coral',
      },
    },
    { day: 6, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 7, reward: null },
    { day: 8, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 9, reward: { visual: 'toy', presentation: 'contained' } },
    { day: 10, reward: null },
    { day: 11, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 12, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 13, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 14, reward: { visual: 'toy', presentation: 'contained' } },
    { day: 15, reward: null },
    { day: 16, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 17, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 18, reward: { visual: 'toy', presentation: 'contained' } },
    { day: 19, reward: null },
    { day: 20, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 21, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 22, reward: null },
    { day: 23, reward: { visual: 'shards', presentation: 'contained' } },
    {
      day: 24,
      reward: {
        visual: 'toy',
        presentation: 'featured',
        badge: '24',
        sticker: 'sage',
      },
    },
    { day: 25, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 26, reward: { visual: 'toy', presentation: 'contained' } },
    { day: 27, reward: null },
    { day: 28, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 29, reward: { visual: 'shards', presentation: 'contained' } },
    { day: 30, reward: { visual: 'toy', presentation: 'contained' } },
    {
      day: 31,
      reward: {
        visual: 'toy',
        presentation: 'featured',
        badge: '31',
        sticker: 'ochre',
      },
    },
  ],
  nextMonthDays: [1, 2, 3, 4],
} as const satisfies DailyCalendarDisplayConfig
