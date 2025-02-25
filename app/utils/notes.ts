import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { notes } from '~/db/schema'
import { z } from 'zod'

const fetchNotesParamsSchema = z
  .object({
    statusFilter: z.enum(['active', 'archived']).optional().default('active'),
    filterBy: z.string().optional(),
  })
  .optional()
  .default({ statusFilter: 'active' })

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
  .validator(fetchNotesParamsSchema)
  .handler(async ({ data: { statusFilter, filterBy } }) => {
    return db.query.notes.findMany({
      where: (notes, { and, eq, or, ilike }) =>
        filterBy
          ? and(
              eq(notes.isArchived, statusFilter === 'archived'),
              or(
                ilike(notes.title, `%${filterBy}%`),
                ilike(notes.content, `%${filterBy}%`),
              ),
            )
          : eq(notes.isArchived, statusFilter === 'archived'),
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

export const deleteNote = createServerFn({ method: 'POST' })
  .validator((d: string) => d)
  .handler(async ({ data: noteId }) => {
    console.info(`Deleting note with id ${noteId}...`)
    await db.delete(notes).where(eq(notes.id, noteId))
    return { success: true }
  })
