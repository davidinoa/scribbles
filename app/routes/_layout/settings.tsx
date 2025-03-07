import { createFileRoute } from '@tanstack/react-router'
import { SettingsMenu } from '~/components/settings-menu'

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <h2 className="mb-6 text-2xl font-semibold">Settings</h2>
      <SettingsMenu />
    </div>
  )
}
