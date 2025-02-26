import React from 'react'

interface EmptyStateProps {
  title?: string
  message?: string
  filterActive?: boolean
  filterMessage?: string
  defaultMessage?: string
  className?: string
}

export function EmptyState({
  title = 'No items found',
  filterActive = false,
  filterMessage = 'No items match your search criteria. Try a different search term.',
  defaultMessage = 'No items available.',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10 ${className}`}
    >
      <p className="mb-2 text-lg font-medium">{title}</p>
      <p className="text-muted-foreground">
        {filterActive ? filterMessage : defaultMessage}
      </p>
    </div>
  )
}
