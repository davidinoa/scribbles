import { createFileRoute } from '@tanstack/react-router'
import { AppearanceSettings } from '~/components/appearance-settings'

export const Route = createFileRoute('/_layout/settings_/appearance')({
  component: AppearanceSettings,
})
