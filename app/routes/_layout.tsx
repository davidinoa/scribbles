import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  LucideArchive,
  LucideNotebook,
  LucideSettings,
  LucideSun,
} from 'lucide-react'
import { LucideHome } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { UserButton } from '@clerk/tanstack-start'
export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const activeLinkProps = {
    className: 'text-blue-500 bg-blue-800/20',
  }
  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_3.5rem]">
      <header className="bg-background-2 text-foreground p-4 text-lg font-bold border-b border-border grid grid-cols-[1fr_auto]">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="Scribbles" className="size-8" />
          <Link to="/" className="pacifico-regular text-2xl">
            Scribbles
          </Link>
        </div>
        <UserButton />
      </header>
      <main className="overflow-y-auto p-4">
        <Outlet />
      </main>
      <nav className="bg-background text-foreground border-t border-border fixed bottom-0 left-0 right-0">
        <ul className="grid grid-cols-4 gap-2 p-2">
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
    </div>
  )
}
