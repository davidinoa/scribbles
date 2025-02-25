import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { LucideHash, LucidePlus } from 'lucide-react'
import { db } from '~/db'
import { notesToTags, tags } from '~/db/schema'
import { sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/start'

const fetchTags = createServerFn({ method: 'GET' }).handler(async () => {
  const tagsWithCounts = await db
    .select({
      id: tags.id,
      name: tags.name,
      count: sql<number>`count(${notesToTags.noteId})::int`,
    })
    .from(tags)
    .leftJoin(notesToTags, sql`${tags.id} = ${notesToTags.tagId}`)
    .groupBy(tags.id, tags.name)
    .orderBy(tags.name)

  return tagsWithCounts
})

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
          <div className="col-span-full text-center text-muted-foreground">
            No tags yet. Create your first tag to get started!
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
