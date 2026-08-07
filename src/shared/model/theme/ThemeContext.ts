import { createContext } from 'react'
import type { ColorScheme } from './theme'

export type ThemeContextValue = {
  colorScheme: ColorScheme
  setColorScheme: (colorScheme: ColorScheme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
