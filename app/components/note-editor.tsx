import {
  formOptions,
  useForm,
  mergeForm,
  useTransform,
  useStore,
} from '@tanstack/react-form'
import { ServerValidateError } from '@tanstack/react-form/start'
import { getRouteApi } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from '@tanstack/start/server'
import { db } from '~/db'
import { notes } from '~/db/schema'
import { cn } from '~/lib/utils'
import { serverValidate } from '~/utils/editor'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'

const formOpts = formOptions({
  defaultValues: {
    title: '',
    content: '',
  },
})

export function NoteEditor() {
  const routeApi = getRouteApi('/_layout/')
  const { state } = routeApi.useLoaderData()

  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  })
  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form
      method="post"
      action={handleForm.url}
      encType="multipart/form-data"
      className="space-y-6"
    >
      {formErrors.map((error) => (
        <p
          key={JSON.stringify(error)}
          className="text-sm font-medium text-destructive"
        >
          {JSON.stringify(error)}
        </p>
      ))}

      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            value.length < 3
              ? 'Client validation: title must be at least 3 characters'
              : undefined,
        }}
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                className={cn(
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a title for your note"
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-sm font-medium text-destructive">
                  {error}
                </p>
              ))}
            </div>
          )
        }}
      </form.Field>

      <form.Field
        name="content"
        validators={{
          onChange: ({ value }) =>
            value.length < 3
              ? 'Client validation: content must be at least 3 characters'
              : undefined,
        }}
      >
        {(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                className={cn(
                  'min-h-[200px] resize-none',
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Write your note here..."
              />
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-sm font-medium text-destructive">
                  {error}
                </p>
              ))}
            </div>
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            variant="outline"
            disabled={!canSubmit}
            className={cn(
              'w-full',
              !canSubmit && 'opacity-50 cursor-not-allowed',
            )}
          >
            {isSubmitting ? '...' : 'Create Note'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export const handleForm = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data')
    }
    return data
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data)
      const formData = Object.fromEntries(ctx.data.entries())
      const [newNote] = await db.insert(notes).values({
        title: formData.title as string,
        content: formData.content as string,
        isArchived: false,
      })
    } catch (e) {
      if (e instanceof ServerValidateError) {
        return e.response
      }
      console.error(e)
      setResponseStatus(500)
      return 'There was an internal error'
    }
    return new Response('ok', { status: 301, headers: { Location: '/notes' } })
  })
