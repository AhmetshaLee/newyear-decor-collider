export type CraftCostModifiers = {
  albumModifier: number
  levelModifier: number
  typeModifier: number
  antiRepeatModifier: number
}

const BASE_CRAFT_COST = 100

export function calculateCraftCost(modifiers: CraftCostModifiers) {
  return (
    BASE_CRAFT_COST +
    modifiers.albumModifier +
    modifiers.levelModifier +
    modifiers.typeModifier +
    modifiers.antiRepeatModifier
  )
}
