import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { UserButton } from '@clerk/tanstack-start'
import { SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/app-sidebar'
import { NavToolbar } from '~/components/nav-toolbar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
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
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="overflow-y-auto p-4 flex-1">
          <Outlet />
        </main>
      </SidebarProvider>
      <NavToolbar />
    </div>
  )
}
