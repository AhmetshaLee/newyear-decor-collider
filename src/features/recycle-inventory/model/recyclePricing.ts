import {
  calculateDecorationValue,
  type Decoration,
} from '@/entities/decoration'

const DECORATION_RECYCLE_RATE = 0.5

export function calculateDecorationRecycleValue(decoration: Decoration) {
  return Math.floor(
    calculateDecorationValue(decoration) * DECORATION_RECYCLE_RATE,
  )
}
