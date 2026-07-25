import type {
  AntiRepeatMode,
  CraftAlbum,
  CraftDecorationType,
  CraftLevel,
  CraftRecipe,
} from './craftRecipe'

type CraftPricing = {
  readonly baseCost: number
  readonly albumModifiers: Readonly<Record<CraftAlbum, number>>
  readonly levelModifiers: Readonly<Record<CraftLevel, number>>
  readonly decorationTypeModifiers: Readonly<
    Record<CraftDecorationType, number>
  >
  readonly antiRepeatModifiers: Readonly<Record<AntiRepeatMode, number>>
}

export const ANTI_REPEAT_SHARDS_SURCHARGE = 1000

const CRAFT_PRICING = {
  baseCost: 100,
  albumModifiers: {
    random: 0,
    classic: 150,
    fairytale: 150,
    oriental: 150,
    magic: 150,
  },
  levelModifiers: {
    random: 0,
    lvl_1: 50,
    lvl_2: 100,
    lvl_3: 200,
    lvl_4: 400,
    lvl_5: 800,
  },
  decorationTypeModifiers: {
    random: 0,
    top: 250,
    lights: 250,
    toys: 250,
    floor: 250,
  },
  antiRepeatModifiers: {
    off: 0,
    useShards: ANTI_REPEAT_SHARDS_SURCHARGE,
  },
} satisfies CraftPricing

export function calculateCraftCost(recipe: CraftRecipe) {
  return (
    CRAFT_PRICING.baseCost +
    CRAFT_PRICING.albumModifiers[recipe.album] +
    CRAFT_PRICING.levelModifiers[recipe.level] +
    CRAFT_PRICING.decorationTypeModifiers[recipe.decorationType] +
    CRAFT_PRICING.antiRepeatModifiers[recipe.antiRepeatMode]
  )
}
