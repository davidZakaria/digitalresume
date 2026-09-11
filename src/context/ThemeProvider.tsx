import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, THEME_STORAGE_KEY, type ThemeMode } from './theme-context'

function readStoredTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'dark' || v === 'light') return v
  } catch {
    /* private mode */
  }
  return null
}

function themeFromDocument(): ThemeMode {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', mode === 'dark' ? '#1c1917' : '#fafaf7')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readStoredTheme() ?? themeFromDocument())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  )
}
