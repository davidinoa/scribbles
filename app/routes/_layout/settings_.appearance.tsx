import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { BackButton } from '../../components/ui/back-button'
import { Sun, Moon } from 'lucide-react'

export const Route = createFileRoute('/_layout/settings_/appearance')({
  component: AppearanceSettings,
})

function AppearanceSettings() {
  return (
    <div className="container max-w-2xl py-8 mx-auto">
      <BackButton to="/settings" />

      <h2 className="mb-8 text-3xl font-bold tracking-tight">Color Theme</h2>

      <div className="space-y-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start gap-3 px-4 py-6"
        >
          <Sun className="h-5 w-5" />
          Light Mode
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start gap-3 px-4 py-6"
        >
          <Moon className="h-5 w-5" />
          Dark Mode
        </Button>
      </div>
    </div>
  )
}
