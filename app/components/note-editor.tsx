import { formOptions, useForm, useStore } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { cn } from '~/lib/utils'
import { handleForm } from '~/lib/server-fns/handle-form'
import { Button } from '~/components/ui/button'
import { Textarea } from './ui/textarea'
import { LucideClock, LucideTag, LucideSave } from 'lucide-react'
import { TagSelector } from './tag-selector'
import { Label } from './ui/label'

const formOpts = formOptions({
  defaultValues: {
    title: '',
    content: '',
    tags: [] as string[],
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
      formData.append('tags', data.value.tags.join(','))
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
      <div className="mb-6 flex items-center justify-end">
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
                'bg-accent text-accent-foreground shadow-sm transition-all hover:bg-accent/90',
                !canSubmit && 'opacity-50',
                'gap-2 rounded-full px-4',
              )}
              size="sm"
            >
              <LucideSave className="size-3.5" />
              {isSubmitting ? 'Saving...' : 'Save'}
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
                  'resize-none border-none bg-transparent px-0 text-3xl font-bold text-foreground shadow-none [field-sizing:content] placeholder:text-muted-foreground/50 focus-visible:shadow-none focus-visible:ring-0 md:text-3xl',
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

      <div className="mb-6 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 text-muted-foreground">
        {/* Tag selector */}
        <Label htmlFor="tags" className="flex items-center gap-2">
          <LucideTag className="size-4" />
          Tags
        </Label>
        <form.Field name="tags">
          {(field) => <TagSelector onChange={field.handleChange} />}
        </form.Field>

        {/* Last edited timestamp */}
        <Label htmlFor="last-edited" className="flex items-center gap-2">
          <div className="flex w-fit items-center gap-2">
            <LucideClock className="size-4" />
            <p className="whitespace-nowrap">Last edited</p>
          </div>
        </Label>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Not yet saved</span>
        </div>
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
                  'w-full resize-none border-none bg-transparent p-0 text-foreground shadow-none [field-sizing:content] placeholder:text-muted-foreground/50 focus-visible:shadow-none focus-visible:ring-0',
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
