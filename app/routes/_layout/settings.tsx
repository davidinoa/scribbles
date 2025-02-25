import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { Sun, Type } from 'lucide-react'

export const Route = createFileRoute('/_layout/settings')({
  component: Settings,
})

function Settings() {
  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

      <div className="space-y-3 rounded-lg border border-border bg-card p-4">
        <Link to="/settings/appearance" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-4 text-base"
          >
            <Sun className="size-5" />
            Color Theme
          </Button>
        </Link>

        <Link to="/settings/font" className="block">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-4 text-base"
          >
            <Type className="size-5" />
            Font Theme
          </Button>
        </Link>
      </div>
    </div>
  )
}
