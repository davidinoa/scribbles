import { getAuth } from '@clerk/tanstack-start/server'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from '@tanstack/start/server'
import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { notes } from '~/db/schema'

export const restoreNote = createServerFn({ method: 'POST' })
  .validator((data: { noteId: string }) => data)
  .handler(async ({ data: { noteId } }) => {
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    await db
      .update(notes)
      .set({ isArchived: false })
      .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    return { success: true }
  })
