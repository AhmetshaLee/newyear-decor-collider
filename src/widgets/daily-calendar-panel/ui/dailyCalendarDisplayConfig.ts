type CalendarRewardVisual = 'shards' | 'decoration'

type CalendarRewardDisplayBase = {
  visual: CalendarRewardVisual
}

type InSlotRewardDisplay = CalendarRewardDisplayBase & {
  presentation: 'in-slot'
}

type StickerRewardDisplay = CalendarRewardDisplayBase & {
  presentation: 'sticker'
  stickerColor: 'coral' | 'sage' | 'ochre'
}

export type CalendarDayRewardDisplay =
  | InSlotRewardDisplay
  | StickerRewardDisplay

type CalendarRewardDisplayConfig = {
  day: number
  reward: CalendarDayRewardDisplay
}

type DailyCalendarDisplayConfig = {
  weekdays: readonly string[]
  activeDay: number
  rewards: readonly CalendarRewardDisplayConfig[]
}

export const DAILY_CALENDAR_DISPLAY_CONFIG = {
  weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  activeDay: 1,
  rewards: [
    { day: 1, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 2, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 4, reward: { visual: 'decoration', presentation: 'in-slot' } },
    {
      day: 5,
      reward: {
        visual: 'decoration',
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    { day: 6, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 8, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 9, reward: { visual: 'decoration', presentation: 'in-slot' } },
    {
      day: 11,
      reward: {
        visual: 'shards',
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    { day: 12, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 13, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 14, reward: { visual: 'decoration', presentation: 'in-slot' } },
    { day: 16, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 17, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 18, reward: { visual: 'decoration', presentation: 'in-slot' } },
    { day: 20, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 21, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 23, reward: { visual: 'shards', presentation: 'in-slot' } },
    {
      day: 24,
      reward: {
        visual: 'shards',
        presentation: 'in-slot',
      },
    },
    { day: 25, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 26, reward: { visual: 'decoration', presentation: 'in-slot' } },
    { day: 28, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 29, reward: { visual: 'shards', presentation: 'in-slot' } },
    { day: 30, reward: { visual: 'decoration', presentation: 'in-slot' } },
    {
      day: 31,
      reward: {
        visual: 'decoration',
        presentation: 'in-slot',
      },
    },
  ],
} as const satisfies DailyCalendarDisplayConfig
