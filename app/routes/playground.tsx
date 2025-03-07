import {
  createFileRoute,
  Outlet,
  useLoaderData,
  useLocation,
} from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { SettingsMenu } from './_layout/settings'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
  loader: async () => {
    return 'hello world'
  },
})

function RouteComponent() {
  const selectedSetting = useLocation({
    select: (location) =>
      location.pathname.split('/').pop() as 'appearance' | 'font',
  })
  const data = useLoaderData({ from: '/playground' })

  return (
    <SidebarProvider>
      <div className="h-screen">
        <div className="grid h-full grid-cols-[auto_auto_1fr]">
          <Sidebar>
            <SidebarContent>{JSON.stringify(data)}</SidebarContent>
          </Sidebar>
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
