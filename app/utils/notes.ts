import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { and, eq } from 'drizzle-orm'
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
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      throw notFound()
    }

    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, userId)),
      with: {
        notesToTags: {
          with: {
            tag: true,
          },
        },
      },
    })

    if (!note) {
      throw notFound()
    }

    return note
  })

export const fetchNotes = createServerFn({ method: 'GET' })
  .validator(fetchNotesParamsSchema)
  .handler(async ({ data: { statusFilter, filterBy } }) => {
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      return []
    }

    return db.query.notes.findMany({
      where: (notes, { and, eq, or, ilike }) =>
        filterBy
          ? and(
              eq(notes.isArchived, statusFilter === 'archived'),
              eq(notes.userId, userId),
              or(
                ilike(notes.title, `%${filterBy}%`),
                ilike(notes.content, `%${filterBy}%`),
              ),
            )
          : and(
              eq(notes.isArchived, statusFilter === 'archived'),
              eq(notes.userId, userId),
            ),
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
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .delete(notes)
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    return { success: true }
  })
