import { ServerValidateError } from '@tanstack/react-form/start'
import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from '@tanstack/start/server'
import { db } from '~/db'
import { notes } from '~/db/schema'
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
      await db.insert(notes).values({
        title: formData.title as string,
        content: formData.content as string,
        isArchived: false,
      })
    } catch (e) {
      if (e instanceof ServerValidateError) return e.response
      console.error(e)
      setResponseStatus(500)
      return 'There was an internal error'
    }
  })
