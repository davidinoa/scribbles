import { Moon } from 'lucide-react'

import { Sun } from 'lucide-react'
import { useTheme } from '~/contexts/theme-context'
import { BackButton } from './back-button'
import { Button } from './ui/button'

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <BackButton to="/settings" />

      <h2 className="mb-6 text-2xl font-semibold">Color Theme</h2>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <Button
          variant="outline"
          size="lg"
          className={`w-full justify-start gap-3 px-4 py-4 text-base ${
            theme === 'light' ? 'border-primary' : ''
          }`}
          onClick={() => setTheme('light')}
        >
          <Sun className="h-5 w-5" />
          Light Mode
        </Button>

        <Button
          variant="outline"
          size="lg"
          className={`w-full justify-start gap-3 px-4 py-4 text-base ${
            theme === 'dark' ? 'border-primary' : ''
          }`}
          onClick={() => setTheme('dark')}
        >
          <Moon className="h-5 w-5" />
          Dark Mode
        </Button>
      </div>
    </div>
  )
}
