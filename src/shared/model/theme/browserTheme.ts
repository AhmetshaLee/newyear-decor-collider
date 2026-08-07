import type { Theme } from './theme'

const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'
const THEME_ATTRIBUTE = 'data-theme'

function getThemeFromMediaQuery(mediaQuery: MediaQueryList): Theme {
  return mediaQuery.matches ? 'dark' : 'light'
}

export function getSystemTheme(): Theme {
  return getThemeFromMediaQuery(window.matchMedia(DARK_THEME_MEDIA_QUERY))
}

export function subscribeToSystemTheme(onChange: (theme: Theme) => void) {
  const mediaQuery = window.matchMedia(DARK_THEME_MEDIA_QUERY)
  const handleChange = () => {
    onChange(getThemeFromMediaQuery(mediaQuery))
  }

  handleChange()
  mediaQuery.addEventListener('change', handleChange)

  return () => {
    mediaQuery.removeEventListener('change', handleChange)
  }
}

export function applyDocumentTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
}
