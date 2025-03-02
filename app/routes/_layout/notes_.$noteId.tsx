import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { deleteNote, fetchNote } from '~/utils/notes'
import { NoteEditor } from '~/components/note-editor'
import { archiveNote } from '~/lib/server-fns/archive-note'

export const Route = createFileRoute('/_layout/notes_/$noteId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const note = await fetchNote({ data: params.noteId })
    return {
      note,
    }
  },
})

function RouteComponent() {
  const { note } = Route.useLoaderData()
  const router = useRouter()
  const deleteNoteFn = useServerFn(deleteNote)
  const archiveNoteFn = useServerFn(archiveNote)

  const handleEditSuccess = (noteId: string) => {
    // Refresh the page to show updated note
    router.invalidate()
  }

  // Extract tag IDs from notesToTags
  const tagIds = note.notesToTags?.map((noteToTag) => noteToTag.tag.id) || []

  return (
    <div className="mx-auto max-w-3xl p-6">
      <NoteEditor
        initialValues={{
          id: note.id,
          title: note.title,
          content: note.content || '',
          tags: tagIds,
          updatedAt: note.updatedAt || note.createdAt,
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
