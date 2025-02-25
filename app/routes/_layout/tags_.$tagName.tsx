import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { LucideArrowLeft, LucideHash } from 'lucide-react'
import { db } from '~/db'
import { notes, notesToTags, tags } from '~/db/schema'
import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/start'

const fetchNotesByTagName = createServerFn({ method: 'GET' })
  .validator((tagName: string) => tagName)
  .handler(async ({ data: tagName }) => {
    const [tag, taggedNotes] = await Promise.all([
      // Fetch tag details
      db.query.tags.findFirst({
        where: eq(tags.name, tagName),
      }),
      // Fetch notes with this tag
      db
        .select({
          id: notes.id,
          title: notes.title,
          content: notes.content,
          createdAt: notes.createdAt,
          updatedAt: notes.updatedAt,
        })
        .from(notes)
        .innerJoin(notesToTags, eq(notes.id, notesToTags.noteId))
        .innerJoin(tags, eq(notesToTags.tagId, tags.id))
        .where(eq(tags.name, tagName))
        .orderBy(notes.updatedAt),
    ])

    if (!tag) {
      throw new Error('Tag not found')
    }

    return {
      tag,
      notes: taggedNotes,
    }
  })

export const Route = createFileRoute('/_layout/tags_/$tagName')({
  loader: ({ params: { tagName } }) => fetchNotesByTagName({ data: tagName }),
  component: TagNotesComponent,
})

function TagNotesComponent() {
  const { tag, notes } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/tags">
            <LucideArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <LucideHash className="size-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{tag.name}</h1>
        </div>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No notes with this tag yet.
          </div>
        ) : (
          notes.map((note) => (
            <Link
              key={note.id}
              to="/notes/$noteId"
              params={{ noteId: note.id }}
              className="block rounded-lg border border-border bg-card-secondary p-4 hover:border-border-hover"
            >
              <h2 className="font-medium">{note.title}</h2>
              {note.content && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {note.content}
                </p>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
