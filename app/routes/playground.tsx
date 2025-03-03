import { createFileRoute, useParams, useSearch } from '@tanstack/react-router'
import { SettingsMenu } from './_layout/settings'
import { FontOptions } from './_layout/settings_.font'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setting }: { setting: 'appearance' | 'font' } = useSearch({
    from: '/playground',
  })
  return (
    <div className="h-screen">
      <div className="grid h-full grid-cols-[auto_1fr]">
        <div className="border-r border-border p-8">
          <SettingsMenu selection={setting} />
        </div>
        <div className="p-8">
          <FontOptions />
        </div>
      </div>
    </div>
  )
}
