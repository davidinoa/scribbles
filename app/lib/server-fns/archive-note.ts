import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/start'
import { db } from '~/db'
import { notes } from '~/db/schema'

export const archiveNote = createServerFn({ method: 'POST' })
  .validator((d: string) => d)
  .handler(async ({ data: noteId }) => {
    await db.update(notes).set({ isArchived: true }).where(eq(notes.id, noteId))
    return { success: true }
  })
