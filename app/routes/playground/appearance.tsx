import { createFileRoute } from '@tanstack/react-router'
import { AppearanceSettings } from '~/components/appearance-settings'

export const Route = createFileRoute('/playground/appearance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppearanceSettings />
}
