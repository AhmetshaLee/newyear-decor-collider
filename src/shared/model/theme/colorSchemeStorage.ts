import { DEFAULT_COLOR_SCHEME, isColorScheme, type ColorScheme } from './theme'

export const COLOR_SCHEME_STORAGE_KEY = 'newyear-decor-collider:color-scheme'

export function loadColorScheme(): ColorScheme {
  try {
    const storedValue = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)

    return isColorScheme(storedValue) ? storedValue : DEFAULT_COLOR_SCHEME
  } catch {
    return DEFAULT_COLOR_SCHEME
  }
}

export function persistColorScheme(colorScheme: ColorScheme): void {
  try {
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme)
  } catch (error: unknown) {
    console.warn(
      'Не удалось сохранить выбранную тему в localStorage. Тема продолжит работать до перезагрузки страницы.',
      error,
    )
  }
}

export function subscribeToColorSchemeStorage(
  onChange: (colorScheme: ColorScheme) => void,
) {
  let storage: Storage

  try {
    storage = window.localStorage
  } catch {
    return () => undefined
  }

  const handleStorageChange = (event: StorageEvent) => {
    const isColorSchemeChange =
      event.storageArea === storage &&
      (event.key === COLOR_SCHEME_STORAGE_KEY || event.key === null)

    if (!isColorSchemeChange) {
      return
    }

    onChange(
      isColorScheme(event.newValue) ? event.newValue : DEFAULT_COLOR_SCHEME,
    )
  }

  window.addEventListener('storage', handleStorageChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
