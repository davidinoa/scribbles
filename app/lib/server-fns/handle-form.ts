import { ServerValidateError } from '@tanstack/react-form/start'
import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from '@tanstack/start/server'
import { getAuth } from '@clerk/tanstack-start/server'
import { getWebRequest } from '@tanstack/start/server'
import { db } from '~/db'
import { notes, notesToTags, tags } from '~/db/schema'
import { serverValidate } from '~/utils/editor'

export const handleForm = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      await serverValidate(ctx.data)
      const formData = Object.fromEntries(ctx.data.entries())
      const { userId } = await getAuth(getWebRequest()!)

      if (!userId) {
        setResponseStatus(401)
        return 'Unauthorized'
      }

      // Insert the note and get the ID
      const [note] = await db
        .insert(notes)
        .values({
          title: formData.title as string,
          content: formData.content as string,
          isArchived: false,
          userId,
        })
        .returning({ id: notes.id })

      // Handle tags if they exist
      const tagsString = formData.tags as string
      if (tagsString && tagsString.length > 0) {
        const tagIds = tagsString.split(',').filter(Boolean)

        // Insert each tag association
        if (tagIds.length > 0) {
          const tagValues = tagIds.map((tagId) => ({
            noteId: note.id,
            tagId,
          }))

          await db.insert(notesToTags).values(tagValues)
        }
      }

      return { success: true, noteId: note.id }
    } catch (e) {
      if (e instanceof ServerValidateError) return e.response
      console.error(e)
      setResponseStatus(500)
      return 'There was an internal error'
    }
  })
