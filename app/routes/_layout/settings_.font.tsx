import { createFileRoute } from '@tanstack/react-router'
import { BackButton } from '~/components/back-button'
import { FontOptions } from '~/components/font-options'

export const Route = createFileRoute('/_layout/settings_/font')({
  component: FontSettings,
})

function FontSettings() {
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <BackButton to="/settings" />
      <h2 className="mb-6 text-2xl font-semibold">Font Theme</h2>
      <FontOptions />
    </div>
  )
}
