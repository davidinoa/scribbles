import { createFileRoute } from '@tanstack/react-router'
import { AppearanceSettings } from '../_layout/settings_.appearance'

export const Route = createFileRoute('/playground/appearance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppearanceSettings />
}
