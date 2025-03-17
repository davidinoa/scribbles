import { getAuth } from '@clerk/tanstack-start/server'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~/db'
import { notes, notesToTags, tags } from '~/db/schema'

const fetchNotesParamsSchema = z
  .object({
    statusFilter: z.enum(['active', 'archived']).optional().default('active'),
    filterBy: z.string().optional(),
  })
  .optional()
  .default({ statusFilter: 'active' })

export const fetchNote = createServerFn({ method: 'GET' })
  .validator((data: string) => data)
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
      where: (notes, { and, eq, or, ilike, exists, sql }) =>
        filterBy
          ? and(
              eq(notes.isArchived, statusFilter === 'archived'),
              eq(notes.userId, userId),
              or(
                ilike(notes.title, `%${filterBy}%`),
                ilike(notes.content, `%${filterBy}%`),
                exists(
                  db
                    .select()
                    .from(notesToTags)
                    .innerJoin(tags, eq(notesToTags.tagId, tags.id))
                    .where(
                      and(
                        eq(notesToTags.noteId, notes.id),
                        ilike(tags.name, `%${filterBy}%`),
                      ),
                    ),
                ),
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

export const updateNote = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      const formData = Object.fromEntries(ctx.data.entries())
      const { userId } = await getAuth(getWebRequest()!)
      const noteId = formData.noteId as string

      if (!userId) {
        return { success: false, error: 'Unauthorized' }
      }

      // Update the note
      await db
        .update(notes)
        .set({
          title: formData.title as string,
          content: formData.content as string,
        })
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))

      // Always handle tags, even if empty
      // First delete existing tag associations
      await db.delete(notesToTags).where(eq(notesToTags.noteId, noteId))

      // Then add new tag associations if there are any
      const tagsString = formData.tags as string
      if (tagsString && tagsString.length > 0) {
        const tagIds = tagsString.split(',').filter(Boolean)

        // Insert each tag association
        if (tagIds.length > 0) {
          const tagValues = tagIds.map((tagId) => ({
            noteId,
            tagId,
          }))

          await db.insert(notesToTags).values(tagValues)
        }
      }

      return { success: true, noteId }
    } catch (e) {
      console.error(e)
      return { success: false, error: 'There was an internal error' }
    }
  })
