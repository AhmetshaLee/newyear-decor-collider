import type { DecorationLevel } from '@/entities/decoration'

export const RANDOM_LEVEL_DROP_WEIGHTS = {
  lvl_1: 900,
  lvl_2: 70,
  lvl_3: 20,
  lvl_4: 8,
  lvl_5: 2,
} satisfies Readonly<Record<DecorationLevel, number>>
