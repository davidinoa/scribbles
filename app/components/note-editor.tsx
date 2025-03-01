import { formOptions, useForm, useStore } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { cn } from '~/lib/utils'
import { handleForm } from '~/lib/server-fns/handle-form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from './ui/textarea'
import { ArrowLeft, LucideClock } from 'lucide-react'

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
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {/* Header section with save button */}
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div for spacing */}
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                'bg-primary text-primary-foreground hover:bg-primary/90',
                !canSubmit && 'opacity-50',
              )}
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </Button>
          )}
        </form.Subscribe>
      </div>

      {/* Error messages */}
      {formErrors.length > 0 && (
        <div className="mb-4">
          {formErrors.map((error) => (
            <p
              key={JSON.stringify(error)}
              className="text-sm font-medium text-destructive"
            >
              {JSON.stringify(error)}
            </p>
          ))}
        </div>
      )}

      {/* Title field */}
      <form.Field
        name="title"
        validators={{
          onSubmit: ({ value }) =>
            value.length < 3
              ? 'Title must be at least 3 characters'
              : undefined,
        }}
      >
        {(field) => {
          return (
            <div className="mb-2">
              <Textarea
                id="title"
                name="title"
                className={cn(
                  'text-3xl font-bold border-none placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:shadow-none shadow-none px-0 text-foreground bg-transparent [field-sizing:content]',
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a title..."
              />
              {field.state.meta.errors.length > 0 && (
                <div className="mt-1">
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error}
                      className="text-sm font-medium text-destructive"
                    >
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Last edited timestamp */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <LucideClock className="size-4" />
        <span>Not yet saved</span>
      </div>

      {/* Content field */}
      <form.Field
        name="content"
        validators={{
          onSubmit: ({ value }) =>
            value.length < 3
              ? 'Content must be at least 3 characters'
              : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <Textarea
                id="content"
                name="content"
                className={cn(
                  'w-full [field-sizing:content] resize-none border-none bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:shadow-none shadow-none text-foreground',
                  field.state.meta.errors.length > 0 && 'border-destructive',
                )}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Start typing your note here..."
              />
              {field.state.meta.errors.length > 0 && (
                <div className="mt-1">
                  {field.state.meta.errors.map((error) => (
                    <p
                      key={error}
                      className="text-sm font-medium text-destructive"
                    >
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        }}
      </form.Field>
    </form>
  )
}
