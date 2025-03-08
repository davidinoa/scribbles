import { useForm, useStore } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { format } from 'date-fns'
import {
  Archive,
  LucideClock,
  LucideSave,
  LucideTag,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { archiveNote } from '~/lib/server-fns/archive-note'
import { handleForm } from '~/lib/server-fns/handle-form'
import { cn } from '~/lib/utils'
import { deleteNote, updateNote } from '~/utils/notes'
import { useToast } from '~/utils/toast-store'
import { TagSelector } from './tag-selector'
import { Label } from './ui/label'
import { Skeleton } from './ui/skeleton'
import { Textarea } from './ui/textarea'

const defaultFormValues = {
  title: '',
  content: '',
  tags: [] as string[],
}

interface NoteEditorProps {
  initialValues?: {
    id: string
    title: string
    content: string
    tags: string[]
    updatedAt?: Date | string | null
  }
  onSuccess?: (noteId: string) => void
}

export function NoteEditor({ initialValues, onSuccess }: NoteEditorProps = {}) {
  const handleFormFn = useServerFn(handleForm)
  const updateNoteFn = useServerFn(updateNote)
  const deleteNoteFn = useServerFn(deleteNote)
  const archiveNoteFn = useServerFn(archiveNote)
  const router = useRouter()
  const { success } = useToast()

  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialValues?.tags || [],
  )

  // Track if date formatting is ready to prevent date formatting errors
  const [isDateReady, setIsDateReady] = useState(false)

  const isEditing = !!initialValues?.id

  // Ensure date handling is ready
  useEffect(() => {
    setIsDateReady(true)
  }, [])

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
          success('Note updated')
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

  // Update the form's tags field when selectedTags changes
  useEffect(() => {
    form.setFieldValue('tags', selectedTags)
  }, [selectedTags, form])

  // Initialize form with tags when component mounts
  useEffect(() => {
    if (initialValues?.tags && initialValues.tags.length > 0) {
      setSelectedTags(initialValues.tags)
    }
  }, [initialValues])

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags)
    // Directly update the form value to ensure it's in sync
    form.setFieldValue('tags', tags)
  }

  const handleDelete = async () => {
    if (isEditing && initialValues) {
      await deleteNoteFn({ data: initialValues.id })
      router.navigate({ to: '/notes' })
    }
  }

  const handleArchive = async () => {
    if (isEditing && initialValues) {
      await archiveNoteFn({ data: initialValues.id })
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
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2" size="sm">
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This note will be moved to your archives. You can restore it
                    later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2" size="sm">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
          {!isDateReady && initialValues?.updatedAt ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span>
              {initialValues?.updatedAt
                ? format(new Date(initialValues.updatedAt), 'PPP')
                : 'Not yet saved'}
            </span>
          )}
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
