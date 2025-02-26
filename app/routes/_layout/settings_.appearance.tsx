import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { BackButton } from '~/components/back-button'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '~/contexts/theme-context'

export const Route = createFileRoute('/_layout/settings_/appearance')({
  component: AppearanceSettings,
})

function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="container max-w-2xl py-6 mx-auto">
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
