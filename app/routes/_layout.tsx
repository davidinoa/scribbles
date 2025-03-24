import { UserButton } from '@clerk/tanstack-start'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '~/components/app-sidebar'
import { NavToolbar } from '~/components/nav-toolbar'
import { SidebarProvider } from '~/components/ui/sidebar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid h-dvh grid-rows-[auto_1fr_3.5rem]">
      <AppHeader />
      <div className="overflow-y-scroll">
        <SidebarProvider defaultOpen={true} className="max-sm:min-h-[unset]">
          <AppSidebar />
          <main className="w-screen flex-1 p-4 max-sm:px-1">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
      <NavToolbar />
    </div>
  )
}

function AppHeader() {
  return (
    <header className="grid grid-cols-[1fr_auto] border-b border-border bg-background-2 p-4 text-lg font-bold text-foreground">
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="Scribbles" className="size-8" />
        <Link to="/" className="pacifico-regular text-2xl">
          Scribbles
        </Link>
      </div>
      <UserButton />
    </header>
  )
}
