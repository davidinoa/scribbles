import { SignIn } from '@clerk/tanstack-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid place-items-center h-screen">
      <SignIn />
    </div>
  )
}
