import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { BackButton } from '~/components/back-button'
import { useTheme } from '~/contexts/theme-context'
import type { FontTheme } from '~/contexts/theme-context'

export const Route = createFileRoute('/_layout/settings_/font')({
  component: FontSettings,
})

function FontSettings() {
  const { fontTheme, setFontTheme } = useTheme()

  const fonts = [
    {
      name: 'System Default',
      value: 'sans' as FontTheme,
      className: 'font-sans',
    },
    { name: 'Serif', value: 'serif' as FontTheme, className: 'font-serif' },
    { name: 'Monospace', value: 'mono' as FontTheme, className: 'font-mono' },
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
            className={`w-full justify-start gap-3 px-4 py-4 text-base ${
              font.className
            } ${fontTheme === font.value ? 'border-primary' : ''}`}
            onClick={() => setFontTheme(font.value)}
          >
            {font.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
