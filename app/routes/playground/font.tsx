import { createFileRoute } from '@tanstack/react-router'
import { FontOptions } from '../_layout/settings_.font'

export const Route = createFileRoute('/playground/font')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FontOptions />
}
