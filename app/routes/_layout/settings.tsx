import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { Sun, Type, Lock } from 'lucide-react'

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="container max-w-2xl py-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Settings</h1>

      <div className="space-y-4">
        {/* Color Theme Link */}
        <Link to="/settings/appearance" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-6 text-lg"
          >
            <Sun className="h-6 w-6" />
            Color Theme
          </Button>
        </Link>

        {/* Font Theme Link */}
        <Link to="/settings/font" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-6 text-lg"
          >
            <Type className="h-6 w-6" />
            Font Theme
          </Button>
        </Link>

        {/* Change Password Link */}
        <Link to="/settings/password" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-6 text-lg"
          >
            <Lock className="h-6 w-6" />
            Change Password
          </Button>
        </Link>
      </div>
    </div>
  )
}
