import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext } from './ThemeContext'
import { applyDocumentTheme, getSystemTheme, type Theme } from './theme'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setCurrentTheme] = useState<Theme>(getSystemTheme)

  useLayoutEffect(() => {
    applyDocumentTheme(theme)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => {
    setCurrentTheme(nextTheme)
  }, [])

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [setTheme, theme],
  )

  return <ThemeContext value={contextValue}>{children}</ThemeContext>
}
