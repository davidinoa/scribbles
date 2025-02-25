import { formOptions, useForm, useStore } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { cn } from '~/lib/utils'
import { handleForm } from '~/lib/server-fns/handle-form'
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
  const handleFormFn = useServerFn(handleForm)
  const router = useRouter()

  const form = useForm({
    ...formOpts,
    onSubmit: async (data) => {
      const formData = new FormData()
      formData.append('title', data.value.title)
      formData.append('content', data.value.content)
      await handleFormFn({ data: formData }).then(() => {
        router.navigate({ to: '/notes' })
      })
    },
  })
  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
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
