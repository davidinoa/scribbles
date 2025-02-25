import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { db } from '~/db'
import { tags, notesToTags } from '~/db/schema'
import { sql } from 'drizzle-orm'

export const fetchTags = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest()!)

  if (!userId) {
    return []
  }

  const tagsWithCounts = await db
    .select({
      id: tags.id,
      name: tags.name,
      count: sql<number>`count(${notesToTags.noteId})::int`,
    })
    .from(tags)
    .leftJoin(notesToTags, sql`${tags.id} = ${notesToTags.tagId}`)
    .where(sql`${tags.userId} = ${userId}`)
    .groupBy(tags.id, tags.name)
    .orderBy(tags.name)

  return tagsWithCounts
})
