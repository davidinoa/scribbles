import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { SettingsMenu } from '../_layout/settings'
import { FontOptions } from '../_layout/settings_.font'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'

export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setting }: { setting: 'appearance' | 'font' } = useSearch({
    from: '/playground/',
  })
  return (
    <SidebarProvider>
      <div className="h-screen">
        <div className="grid h-full grid-cols-[auto_auto_1fr]">
          <Sidebar />
          <div className="flex flex-col border-r border-border p-8">
            <div className="flex-1">
              <SettingsMenu selection={setting} />
            </div>
            <SidebarTrigger className="text-muted-foreground" />
          </div>
          <div className="p-8">
            <FontOptions />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
