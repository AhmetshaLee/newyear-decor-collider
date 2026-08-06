export const THEMES = ['light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

const THEME_ATTRIBUTE = 'data-theme'

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function applyDocumentTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
}
