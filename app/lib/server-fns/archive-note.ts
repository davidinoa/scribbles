import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { db } from '~/db'
import { notes } from '~/db/schema'

export const archiveNote = createServerFn({ method: 'POST' })
  .validator((d: string) => d)
  .handler(async ({ data: noteId }) => {
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .update(notes)
      .set({ isArchived: true })
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    return { success: true }
  })
