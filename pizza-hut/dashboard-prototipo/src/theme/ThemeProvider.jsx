import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Mesmos valores de styles/tokens.css, repetidos aqui porque o canvas do ECharts não lê variáveis CSS.
export const PALETTES = {
  light: {
    primary: '#C00000',
    accent: '#E81820',
    bg: '#F8F8F8',
    card: '#FFFFFF',
    text: '#202020',
    muted: '#6B6B6B',
    grid: '#ECECEC',
    border: '#E4E4E4',
    ok: '#2E9E5B',
    warn: '#E0A100',
    bad: '#E81820',
    h: '#C00000',
    r: '#3A3A3A',
    series: ['#C00000', '#3A3A3A', '#E8A0A0', '#9A9A9A', '#701818', '#F0C8C8'],
    ramp: ['#FBE9E9', '#F3B9B9', '#E27777', '#C00000', '#701818'],
  },
  dark: {
    primary: '#E81820',
    accent: '#FF4A4F',
    bg: '#171717',
    card: '#232323',
    text: '#F5F5F5',
    muted: '#A8A8A8',
    grid: '#2F2F2F',
    border: '#333333',
    ok: '#3CC47A',
    warn: '#F2B01E',
    bad: '#FF5A5F',
    h: '#FF4A4F',
    r: '#D9D9D9',
    series: ['#FF4A4F', '#D9D9D9', '#A02020', '#8A8A8A', '#E8A0A0', '#5A1A1C'],
    ramp: ['#2A1718', '#5A1A1C', '#A02020', '#E81820', '#FF8A8D'],
  },
}

const ThemeContext = createContext(null)

function inicial() {
  try {
    const salvo = localStorage.getItem('ph-theme')
    if (salvo === 'light' || salvo === 'dark') return salvo
  } catch {
    /* sem armazenamento: segue o sistema */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(inicial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('ph-theme', theme)
    } catch {
      /* ignora */
    }
  }, [theme])

  const toggle = useCallback(() => {
    const root = document.documentElement
    root.classList.add('theme-fade')
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
    window.setTimeout(() => root.classList.remove('theme-fade'), 500)
  }, [])

  const value = useMemo(() => ({ theme, toggle, c: PALETTES[theme] }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
