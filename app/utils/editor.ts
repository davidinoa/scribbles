import { formOptions } from '@tanstack/react-form'
import { ServerValidateError } from '@tanstack/react-form/start'

import { createServerValidate } from '@tanstack/react-form/start'
import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from '@tanstack/start/server'
import { db } from '~/db'
import { notes } from '~/db/schema'

const formOpts = formOptions({
  defaultValues: {
    title: '',
    content: '',
  },
})
export const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: async ({ value }) => {
    if (value.title === 'test') {
      return {
        title: 'Server validation: Title is required',
      }
    }
  },
})
