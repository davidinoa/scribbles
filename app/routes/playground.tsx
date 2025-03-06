import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { fallback, zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { SettingsMenu } from './_layout/settings'

const playgroundSearchSchema = z.object({
  setting: fallback(z.enum(['appearance', 'font']), 'appearance'),
})

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
  validateSearch: zodValidator(playgroundSearchSchema),
})

function RouteComponent() {
  const location = useLocation()
  const pathname = location.pathname
  const selectedSetting = pathname.split('/').pop() as 'appearance' | 'font'

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
