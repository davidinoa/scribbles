import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { LucideArchive, LucideNotebook, LucideSettings } from 'lucide-react'
import { LucideHome } from 'lucide-react'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const activeLinkProps = { className: 'text-blue-500' }
  return (
    <div className="h-dvh grid grid-rows-[auto_1fr_3.5rem]">
      <header className="dark:bg-gray-950 dark:text-gray-200 bg-white text-primary-foreground p-4 text-lg font-bold border-b border-gray-200 dark:border-gray-800">
        <Link to="/">Scribbles</Link>
      </header>
      <main className="overflow-y-auto p-4">
        <Outlet />
      </main>
      <nav className="dark:bg-gray-950 dark:text-gray-200 border-t fixed bottom-0 left-0 right-0 bg-white">
        <ul className="grid grid-cols-4 gap-2 p-2 py-6">
          <li className="flex justify-center">
            <Link to="/" activeProps={activeLinkProps}>
              <LucideHome size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/notes" activeProps={activeLinkProps}>
              <LucideNotebook size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/archive" activeProps={activeLinkProps}>
              <LucideArchive size={24} />
            </Link>
          </li>
          <li className="flex justify-center">
            <Link to="/settings" activeProps={activeLinkProps}>
              <LucideSettings size={24} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
