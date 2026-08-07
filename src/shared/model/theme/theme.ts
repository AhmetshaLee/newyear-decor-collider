export const COLOR_SCHEMES = ['auto', 'light', 'dark'] as const

export type ColorScheme = (typeof COLOR_SCHEMES)[number]
export type Theme = Exclude<ColorScheme, 'auto'>
export const DEFAULT_COLOR_SCHEME: ColorScheme = 'auto'

export function isColorScheme(value: unknown): value is ColorScheme {
  return COLOR_SCHEMES.some((colorScheme) => colorScheme === value)
}

export function resolveTheme(
  colorScheme: ColorScheme,
  systemTheme: Theme,
): Theme {
  return colorScheme === 'auto' ? systemTheme : colorScheme
}
