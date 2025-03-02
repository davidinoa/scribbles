import { Link } from '@tanstack/react-router'
import {
  LucideArchive,
  LucideHome,
  LucideNotebook,
  LucideSettings,
  LucideTag,
} from 'lucide-react'
import { Button } from '~/components/ui/button'

export function NavToolbar() {
  const navItems = [
    {
      label: 'Home',
      icon: LucideHome,
      to: '/',
    },
    {
      label: 'Notes',
      icon: LucideNotebook,
      to: '/notes',
    },
    {
      label: 'Tags',
      icon: LucideTag,
      to: '/tags',
    },
    {
      label: 'Archive',
      icon: LucideArchive,
      to: '/archive',
    },
    {
      label: 'Settings',
      icon: LucideSettings,
      to: '/settings',
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background text-foreground sm:hidden">
      <ul className="grid grid-cols-5 gap-2 p-2">
        {navItems.map((item) => (
          <li className="flex justify-center" key={item.label}>
            <Button variant="link" asChild className="p-6">
              <Link
                to={item.to}
                activeProps={{ className: 'text-blue-500 bg-blue-800/20' }}
              >
                <item.icon />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
