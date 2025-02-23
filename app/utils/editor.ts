import { ServerValidateError } from '@tanstack/react-form/start'
import { createServerValidate } from '@tanstack/react-form/start'
import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from '@tanstack/start/server'
import { db } from '~/db'
import { notes } from '~/db/schema'

export const serverValidate = createServerValidate({
  defaultValues: {
    title: '',
    content: '',
  },
  onServerValidate: async ({ value }) => {
    if (value.title === 'test') {
      return {
        title: 'Server validation: Title is required',
      }
    }
  },
})
