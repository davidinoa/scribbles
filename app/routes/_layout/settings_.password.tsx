import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { BackButton } from '../../components/ui/back-button'

export const Route = createFileRoute('/_layout/settings_/password')({
  component: PasswordSettings,
})

function PasswordSettings() {
  return (
    <div className="container max-w-2xl py-8 mx-auto">
      <BackButton to="/settings" />

      <h2 className="mb-8 text-3xl font-bold tracking-tight">
        Change Password
      </h2>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            placeholder="Enter your current password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
          />
        </div>

        <Button type="submit" className="w-full">
          Update Password
        </Button>
      </form>
    </div>
  )
}
