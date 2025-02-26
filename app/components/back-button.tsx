import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  to: string
  label?: string
}

export function BackButton({ to, label = 'Back' }: BackButtonProps) {
  return (
    <Link to={to} className="mb-6 block">
      <Button variant="ghost" className="gap-2 pl-0 text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  )
}
