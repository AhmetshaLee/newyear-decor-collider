import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext } from './ThemeContext'
import {
  loadColorScheme,
  persistColorScheme,
  subscribeToColorSchemeStorage,
} from './colorSchemeStorage'
import {
  applyDocumentTheme,
  getSystemTheme,
  subscribeToSystemTheme,
} from './browserTheme'
import { resolveTheme, type ColorScheme, type Theme } from './theme'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorScheme, setCurrentColorScheme] =
    useState<ColorScheme>(loadColorScheme)
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme)
  const resolvedTheme = resolveTheme(colorScheme, systemTheme)

  useLayoutEffect(() => {
    applyDocumentTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    return subscribeToSystemTheme(setSystemTheme)
  }, [])

  useEffect(() => {
    return subscribeToColorSchemeStorage(setCurrentColorScheme)
  }, [])

  const setColorScheme = useCallback((nextColorScheme: ColorScheme) => {
    setCurrentColorScheme(nextColorScheme)
    persistColorScheme(nextColorScheme)
  }, [])

  const contextValue = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
    }),
    [colorScheme, setColorScheme],
  )

  return <ThemeContext value={contextValue}>{children}</ThemeContext>
}
