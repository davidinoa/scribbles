import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { db } from '~/db'
import { tags } from '~/db/schema'
import { sql } from 'drizzle-orm'

export const fetchTagOptions = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      return []
    }

    const tagOptions = await db
      .select({
        value: tags.id,
        label: tags.name,
      })
      .from(tags)
      .where(sql`${tags.userId} = ${userId}`)
      .orderBy(tags.name)

    return tagOptions
  },
)
