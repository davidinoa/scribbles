import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { BackButton } from '../../components/ui/back-button'

export const Route = createFileRoute('/_layout/settings_/font')({
  component: FontSettings,
})

function FontSettings() {
  const fonts = [
    { name: 'System Default', className: 'font-sans' },
    { name: 'Serif', className: 'font-serif' },
    { name: 'Monospace', className: 'font-mono' },
  ]

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <BackButton to="/settings" />

      <h2 className="mb-6 text-2xl font-semibold">Font Theme</h2>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        {fonts.map((font) => (
          <Button
            key={font.name}
            variant="outline"
            size="lg"
            className={`w-full justify-start gap-3 px-4 py-4 text-base ${font.className}`}
          >
            {font.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
