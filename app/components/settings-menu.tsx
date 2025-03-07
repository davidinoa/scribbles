import { ChevronRight, Link, Sun, Type } from 'lucide-react'
import { useIsMobile } from '~/hooks/use-mobile'
import { cn } from '~/lib/utils'
import { Button } from './ui/button'

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
