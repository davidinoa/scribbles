import { useForm, useStore } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { format } from 'date-fns'
import { LucideClock, LucideSave, LucideTag } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { archiveNote } from '~/lib/server-fns/archive-note'
import { handleForm } from '~/lib/server-fns/handle-form'
import { cn } from '~/lib/utils'
import { deleteNote, updateNote } from '~/utils/notes'
import { FormError } from './form-error'
import { NoteActions } from './note-actions'
import { TagSelector } from './tag-selector'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const defaultFormValues = {
  title: '',
  content: '',
  tags: [] as string[],
}

type NoteEditorProps = {
  initialValues?: {
    id: string
    title: string
    content: string
    tags: string[]
    updatedAt?: Date | string
  }
  onSuccess?: (noteId: string) => void
}

export function NoteEditor({ initialValues, onSuccess }: NoteEditorProps = {}) {
  const handleFormFn = useServerFn(handleForm)
  const updateNoteFn = useServerFn(updateNote)
  const deleteNoteFn = useServerFn(deleteNote)
  const archiveNoteFn = useServerFn(archiveNote)
  const router = useRouter()

  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialValues?.tags || [],
  )
  const isEditing = !!initialValues?.id

  const form = useForm({
    defaultValues: initialValues
      ? {
          title: initialValues.title,
          content: initialValues.content,
          tags: initialValues.tags,
        }
      : defaultFormValues,
    onSubmit: async (data) => {
      const formData = new FormData()
      formData.append('title', data.value.title)
      formData.append('content', data.value.content)
      formData.append('tags', data.value.tags.join(','))
      if (isEditing && initialValues) {
        // Update existing note
        formData.append('noteId', initialValues.id)
        const result = await updateNoteFn({ data: formData })

        if (
          typeof result === 'object' &&
          'success' in result &&
          result.success &&
          onSuccess &&
          'noteId' in result
        ) {
          onSuccess(result.noteId as string)
          toast.success('Note updated')
        } else {
          router.navigate({ to: '/notes' })
        }
      } else {
        // Create new note
        const result = await handleFormFn({ data: formData })
        if (
          typeof result === 'object' &&
          'success' in result &&
          result.success &&
          onSuccess &&
          'noteId' in result
        ) {
          onSuccess(result.noteId as string)
        } else {
          router.navigate({ to: '/notes' })
        }
      }
    },
  })
  const formErrors = useStore(form.store, (formState) => formState.errors)

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags)
    form.setFieldValue('tags', tags)
  }

  const handleDelete = async () => {
    if (isEditing && initialValues) {
      await deleteNoteFn({ data: initialValues.id })
      toast.info('Note deleted')
      router.navigate({ to: '/notes' })
    }
  }

  const handleArchive = async () => {
    if (isEditing && initialValues) {
      await archiveNoteFn({ data: initialValues.id })
      toast.info('Note archived')
      router.navigate({ to: '/notes' })
    }
  }

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
      <div className="mb-6 flex items-center justify-between">
        {isEditing && (
          <NoteActions onArchive={handleArchive} onDelete={handleDelete} />
        )}
        <div className={isEditing ? '' : 'ml-auto'}>
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
              <FormError errors={field.state.meta.errors} className="mt-1" />
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
        <TagSelector
          onChange={handleTagsChange}
          initialSelectedTags={selectedTags}
        />

        {/* Last edited timestamp */}
        <Label htmlFor="last-edited" className="flex items-center gap-2">
          <div className="flex w-fit items-center gap-2">
            <LucideClock className="size-4" />
            <p className="whitespace-nowrap">Last edited</p>
          </div>
        </Label>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>
            {initialValues?.updatedAt
              ? format(new Date(initialValues.updatedAt), 'PPP')
              : 'Not yet saved'}
          </span>
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
              <FormError errors={field.state.meta.errors} className="mt-1" />
            </div>
          )
        }}
      </form.Field>
    </form>
  )
}
