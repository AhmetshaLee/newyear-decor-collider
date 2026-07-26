import {
  DECORATION_LEVEL_VALUES,
  type Decoration,
  type DecorationLevel,
} from '@/entities/decoration'
import { RANDOM_LEVEL_DROP_WEIGHTS } from './craftDropWeights'

function pickRandomDecoration(
  decorations: readonly Decoration[],
  randomValue: number,
) {
  const randomIndex = Math.max(
    0,
    Math.min(
      Math.floor(randomValue * decorations.length),
      decorations.length - 1,
    ),
  )

  return decorations[randomIndex]
}

function getAvailableLevels(
  decorations: readonly Decoration[],
): DecorationLevel[] {
  return DECORATION_LEVEL_VALUES.filter((level) =>
    decorations.some((decoration) => decoration.level === level),
  )
}

function pickWeightedLevel(
  availableLevels: readonly DecorationLevel[],
  randomValue: number,
) {
  const totalWeight = availableLevels.reduce(
    (sum, level) => sum + RANDOM_LEVEL_DROP_WEIGHTS[level],
    0,
  )

  const targetWeight = randomValue * totalWeight
  let accumulatedWeight = 0

  for (const level of availableLevels) {
    accumulatedWeight += RANDOM_LEVEL_DROP_WEIGHTS[level]

    if (targetWeight < accumulatedWeight) return level
  }

  return availableLevels[availableLevels.length - 1]
}

export function pickRandomCraftDecoration(
  decorations: readonly Decoration[],
  randomValue: number,
) {
  return pickRandomDecoration(decorations, randomValue)
}

export function pickWeightedCraftDecoration(
  decorations: readonly Decoration[],
  levelRandomValue: number,
  decorationRandomValue: number,
) {
  const availableLevels = getAvailableLevels(decorations)
  const selectedLevel = pickWeightedLevel(availableLevels, levelRandomValue)
  const levelPool = decorations.filter(
    (decoration) => decoration.level === selectedLevel,
  )

  return pickRandomDecoration(levelPool, decorationRandomValue)
}
