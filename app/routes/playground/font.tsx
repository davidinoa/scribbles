import { createFileRoute } from '@tanstack/react-router'
import { FontOptions } from '~/components/font-options'

export const Route = createFileRoute('/playground/font')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FontOptions />
}
