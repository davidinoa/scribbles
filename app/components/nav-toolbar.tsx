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
  const activeLinkProps = {
    className: 'text-blue-500 bg-blue-800/20',
  }

  return (
    <nav className="bg-background text-foreground border-t border-border fixed bottom-0 left-0 right-0 sm:hidden">
      <ul className="grid grid-cols-5 gap-2 p-2">
        <li className="flex justify-center">
          <Button variant="link" asChild className="p-6">
            <Link
              to="/"
              activeProps={activeLinkProps}
              className="block size-fit"
            >
              <LucideHome />
            </Link>
          </Button>
        </li>
        <li className="flex justify-center">
          <Button variant="link" asChild className="p-6">
            <Link
              to="/notes"
              activeProps={activeLinkProps}
              className="block size-fit"
            >
              <LucideNotebook />
            </Link>
          </Button>
        </li>
        <li className="flex justify-center">
          <Button variant="link" asChild className="p-6">
            <Link
              to="/tags"
              activeProps={activeLinkProps}
              className="block size-fit"
            >
              <LucideTag />
            </Link>
          </Button>
        </li>
        <li className="flex justify-center">
          <Button variant="link" asChild className="p-6">
            <Link
              to="/archive"
              activeProps={activeLinkProps}
              className="block size-fit"
            >
              <LucideArchive />
            </Link>
          </Button>
        </li>
        <li className="flex justify-center">
          <Button variant="link" asChild className="p-6">
            <Link
              to="/settings"
              activeProps={activeLinkProps}
              className="block size-fit"
            >
              <LucideSettings />
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  )
}
