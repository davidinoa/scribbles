import { createServerFn } from '@tanstack/start'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { db } from '~/db'
import { tags } from '~/db/schema'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
})

export const createTag = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const result = createTagSchema.safeParse(data)
    if (!result.success) {
      throw new Error('Invalid input')
    }
    return result.data
  })
  .handler(async (ctx) => {
    const { name } = ctx.data
    const { userId } = await getAuth(getWebRequest()!)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Check if tag already exists for this user
    const existingTag = await db
      .select({ id: tags.id })
      .from(tags)
      .where(sql`${tags.name} = ${name} AND ${tags.userId} = ${userId}`)
      .limit(1)

    if (existingTag.length > 0) {
      return {
        value: existingTag[0].id,
        label: name,
      }
    }

    // Create new tag
    const [newTag] = await db
      .insert(tags)
      .values({
        name,
        userId,
      })
      .returning({ id: tags.id })

    return {
      value: newTag.id,
      label: name,
    }
  })
