import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
export type FontTheme = 'sans' | 'serif' | 'mono'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  fontTheme: FontTheme
  setFontTheme: (fontTheme: FontTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Try to get the theme from localStorage
      const savedTheme = localStorage.getItem('theme') as Theme
      return savedTheme || 'dark'
    }
    return 'dark'
  })

  const [fontTheme, setFontTheme] = useState<FontTheme>(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Try to get the font theme from localStorage
      const savedFontTheme = localStorage.getItem('fontTheme') as FontTheme
      return savedFontTheme || 'sans'
    }
    return 'sans'
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme)

    // Apply theme to document element
    const root = window.document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // Save font theme to localStorage
    localStorage.setItem('fontTheme', fontTheme)

    // Apply font theme to document element
    const root = window.document.documentElement

    // Remove all font classes first
    root.classList.remove('font-sans', 'font-serif', 'font-mono')

    // Add the selected font class
    root.classList.add(`font-${fontTheme}`)
  }, [fontTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontTheme, setFontTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
