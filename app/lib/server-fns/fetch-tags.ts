import { createServerFn } from '@tanstack/start'
import { db } from '~/db'
import { tags, notesToTags } from '~/db/schema'
import { sql } from 'drizzle-orm'

export const fetchTags = createServerFn({ method: 'GET' }).handler(async () => {
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
