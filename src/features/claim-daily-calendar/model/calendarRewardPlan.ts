type StickerColor = 'coral' | 'sage' | 'ochre'

type CalendarRewardPlacement =
  | {
      amount: number
      presentation: 'in-slot'
    }
  | {
      amount: number
      presentation: 'sticker'
      stickerColor: StickerColor
    }

export type CalendarRewardSlot = CalendarRewardPlacement & {
  day: number
}

type CalendarMonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

type CalendarRewardOverride = {
  day: number
  placement: CalendarRewardPlacement | null
}

const DEFAULT_REWARD_SLOTS = [
  { day: 1, amount: 100, presentation: 'in-slot' },
  { day: 2, amount: 120, presentation: 'in-slot' },
  { day: 3, amount: 140, presentation: 'in-slot' },
  { day: 5, amount: 180, presentation: 'in-slot' },
  { day: 6, amount: 200, presentation: 'in-slot' },
  { day: 7, amount: 220, presentation: 'in-slot' },
  { day: 8, amount: 240, presentation: 'in-slot' },
  { day: 9, amount: 260, presentation: 'in-slot' },
  { day: 10, amount: 280, presentation: 'in-slot' },
  { day: 11, amount: 300, presentation: 'in-slot' },
  { day: 12, amount: 320, presentation: 'in-slot' },
  { day: 13, amount: 340, presentation: 'in-slot' },
  { day: 14, amount: 360, presentation: 'in-slot' },
  { day: 15, amount: 380, presentation: 'in-slot' },
  { day: 16, amount: 400, presentation: 'in-slot' },
  { day: 17, amount: 420, presentation: 'in-slot' },
  { day: 18, amount: 440, presentation: 'in-slot' },
  { day: 19, amount: 460, presentation: 'in-slot' },
  { day: 20, amount: 480, presentation: 'in-slot' },
  { day: 21, amount: 500, presentation: 'in-slot' },
  { day: 22, amount: 520, presentation: 'in-slot' },
  { day: 23, amount: 540, presentation: 'in-slot' },
  { day: 24, amount: 560, presentation: 'in-slot' },
  { day: 25, amount: 580, presentation: 'in-slot' },
  { day: 26, amount: 600, presentation: 'in-slot' },
  { day: 27, amount: 620, presentation: 'in-slot' },
  { day: 28, amount: 640, presentation: 'in-slot' },
  { day: 29, amount: 660, presentation: 'in-slot' },
  { day: 30, amount: 680, presentation: 'in-slot' },
  { day: 31, amount: 700, presentation: 'in-slot' },
] as const satisfies readonly CalendarRewardSlot[]

const MONTHLY_REWARD_OVERRIDES = {
  0: [
    {
      day: 5,
      placement: {
        amount: 600,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 24,
      placement: { amount: 900, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 31,
      placement: {
        amount: 1200,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  1: [
    {
      day: 7,
      placement: { amount: 650, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 14,
      placement: {
        amount: 800,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 28,
      placement: {
        amount: 1000,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  2: [
    {
      day: 6,
      placement: {
        amount: 620,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 23,
      placement: {
        amount: 900,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 31,
      placement: {
        amount: 1200,
        presentation: 'sticker',
        stickerColor: 'sage',
      },
    },
  ],
  3: [
    {
      day: 4,
      placement: { amount: 600, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 20,
      placement: {
        amount: 900,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 30,
      placement: {
        amount: 1100,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
  ],
  4: [
    {
      day: 8,
      placement: {
        amount: 650,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 25,
      placement: {
        amount: 950,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 31,
      placement: {
        amount: 1250,
        presentation: 'sticker',
        stickerColor: 'sage',
      },
    },
  ],
  5: [
    {
      day: 5,
      placement: { amount: 600, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 21,
      placement: {
        amount: 900,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 30,
      placement: {
        amount: 1150,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  6: [
    {
      day: 7,
      placement: {
        amount: 650,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 24,
      placement: {
        amount: 1000,
        presentation: 'sticker',
        stickerColor: 'sage',
      },
    },
    {
      day: 31,
      placement: {
        amount: 1300,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  7: [
    {
      day: 5,
      placement: {
        amount: 700,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 24,
      placement: {
        amount: 1050,
        presentation: 'sticker',
        stickerColor: 'sage',
      },
    },
    {
      day: 31,
      placement: {
        amount: 1400,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  8: [
    {
      day: 6,
      placement: { amount: 650, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 23,
      placement: {
        amount: 950,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 30,
      placement: {
        amount: 1200,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
  ],
  9: [
    {
      day: 4,
      placement: {
        amount: 600,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 22,
      placement: { amount: 950, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 31,
      placement: {
        amount: 1250,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
  ],
  10: [
    {
      day: 8,
      placement: {
        amount: 700,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 22,
      placement: {
        amount: 950,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
    {
      day: 30,
      placement: {
        amount: 1200,
        presentation: 'sticker',
        stickerColor: 'sage',
      },
    },
  ],
  11: [
    {
      day: 5,
      placement: { amount: 650, presentation: 'sticker', stickerColor: 'sage' },
    },
    {
      day: 24,
      placement: {
        amount: 1100,
        presentation: 'sticker',
        stickerColor: 'ochre',
      },
    },
    {
      day: 31,
      placement: {
        amount: 1500,
        presentation: 'sticker',
        stickerColor: 'coral',
      },
    },
  ],
} as const satisfies Readonly<
  Record<CalendarMonthIndex, readonly CalendarRewardOverride[]>
>

function isCalendarMonthIndex(value: number): value is CalendarMonthIndex {
  return Number.isInteger(value) && value >= 0 && value <= 11
}

export function createCalendarRewardPlan(
  monthIndex: number,
  daysInMonth: number,
): readonly CalendarRewardSlot[] {
  const rewardsByDay = new Map<number, CalendarRewardSlot>(
    DEFAULT_REWARD_SLOTS.map((slot) => [slot.day, slot]),
  )

  const monthlyOverrides = isCalendarMonthIndex(monthIndex)
    ? MONTHLY_REWARD_OVERRIDES[monthIndex]
    : []

  for (const override of monthlyOverrides) {
    if (override.placement === null) {
      rewardsByDay.delete(override.day)
      continue
    }

    rewardsByDay.set(override.day, {
      day: override.day,
      ...override.placement,
    })
  }

  return [...rewardsByDay.values()]
    .filter((slot) => slot.day <= daysInMonth)
    .sort((left, right) => left.day - right.day)
}
