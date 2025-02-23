import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { notes, type tags } from '~/db/schema'

export type NoteType = typeof notes.$inferSelect & {
  notesToTags?: Array<{
    id: string
    tag: typeof tags.$inferSelect
  }>
}

export const fetchNote = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data: noteId }) => {
    console.info(`Fetching note with id ${noteId}...`)
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
    })

    if (!note) {
      throw notFound()
    }

    return note
  })

export const fetchNotes = createServerFn({ method: 'GET' })
  .validator((d?: boolean) => d)
  .handler(async ({ data: isArchived = false }) => {
    console.info(`Fetching ${isArchived ? 'archived' : 'active'} notes...`)
    return db.query.notes.findMany({
      where: eq(notes.isArchived, isArchived),
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
      with: {
        notesToTags: {
          with: {
            tag: true,
          },
        },
      },
    })
  })
