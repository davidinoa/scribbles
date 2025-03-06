import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { SettingsMenu } from './_layout/settings'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  const selectedSetting = useLocation({
    select: (location) =>
      location.pathname.split('/').pop() as 'appearance' | 'font',
  })

  return (
    <SidebarProvider>
      <div className="h-screen">
        <div className="grid h-full grid-cols-[auto_auto_1fr]">
          <Sidebar />
          <div className="flex flex-col border-r border-border p-8">
            <div className="flex-1">
              <SettingsMenu selection={selectedSetting} />
            </div>
            <SidebarTrigger className="text-muted-foreground" />
          </div>
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
