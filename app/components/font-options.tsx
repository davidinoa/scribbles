import { useTheme, type FontTheme } from '~/contexts/theme-context'
import { Button } from './ui/button'

export function FontOptions() {
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
  )
}
