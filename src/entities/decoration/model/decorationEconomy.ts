import type { Decoration } from './decorationsRegistry'
import type { DecorationLevel } from './decorationValues'

const DECORATION_VALUE_BY_LEVEL = {
  lvl_1: 150,
  lvl_2: 200,
  lvl_3: 300,
  lvl_4: 500,
  lvl_5: 900,
} satisfies Readonly<Record<DecorationLevel, number>>

export function calculateDecorationValue(decoration: Decoration) {
  return DECORATION_VALUE_BY_LEVEL[decoration.level]
}
