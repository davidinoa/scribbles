import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { LucideHash, LucidePlus } from 'lucide-react'
import { fetchTags } from '~/lib/server-fns/fetch-tags'
import { EmptyState } from '~/components/empty-state'

export const Route = createFileRoute('/_layout/tags')({
  loader: async () => {
    return fetchTags()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const tags = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Button size="sm" className="gap-2">
          <LucidePlus className="size-4" />
          New Tag
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              title="No tags found"
              defaultMessage="You haven't created any tags yet. Create your first tag to get started!"
            />
          </div>
        ) : (
          tags.map((tag) => (
            <Link
              key={tag.id}
              to="/tags/$tagName"
              params={{ tagName: tag.name }}
              className="flex items-center justify-between rounded-lg border border-border bg-card-secondary p-4 hover:border-border-hover"
            >
              <div className="flex items-center gap-2">
                <LucideHash className="size-4 text-muted-foreground" />
                <span className="font-medium">{tag.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {tag.count} {tag.count === 1 ? 'note' : 'notes'}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
