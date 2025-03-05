import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Sun, Type, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useIsMobile } from '~/hooks/use-mobile'

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
})

export function Settings() {
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h2 className="mb-6 text-2xl font-semibold">Settings</h2>
      <SettingsMenu />
    </div>
  )
}

export function SettingsMenu({
  selection,
}: {
  selection?: 'appearance' | 'font'
}) {
  const isMobile = useIsMobile()
  const viewport = isMobile ? 'mobile' : 'desktop'
  const linkDestinations = {
    desktop: {
      appearance: '/playground/appearance',
      font: '/playground/font',
    },
    mobile: {
      appearance: '/settings/appearance',
      font: '/settings/font',
    },
  }

  return (
    <div className="min-w-max space-y-3 rounded-lg">
      <Link to={linkDestinations[viewport].appearance} className="block">
        <Button
          variant="ghost"
          className={cn(
            'group w-full justify-between border-2 border-transparent px-4 py-4 text-base hover:bg-accent',
            selection === 'appearance' && 'border-primary bg-accent/50',
          )}
        >
          <div className="flex items-center gap-3">
            <Sun
              className={cn(
                'size-5',
                selection === 'appearance' && 'text-ds-accent',
              )}
            />
            Color Theme
          </div>
          <ChevronRight
            className={cn(
              'size-5',
              selection === 'appearance' ? 'text-foreground' : 'invisible',
            )}
          />
        </Button>
      </Link>
      <Link to={linkDestinations[viewport].font} className="block">
        <Button
          variant="ghost"
          className={cn(
            'group w-full justify-between border-2 border-transparent px-4 py-4 text-base hover:bg-accent',
            selection === 'font' && 'border-primary bg-accent/50',
          )}
        >
          <div className="flex items-center gap-3">
            <Type
              className={cn('size-5', selection === 'font' && 'text-ds-accent')}
            />
            Font Theme
          </div>
          <ChevronRight
            className={cn(
              'size-5',
              selection === 'font' ? 'text-foreground' : 'invisible',
            )}
          />
        </Button>
      </Link>
    </div>
  )
}
