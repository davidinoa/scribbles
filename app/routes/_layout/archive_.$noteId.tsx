import { createFileRoute, useRouter } from '@tanstack/react-router'
import { NoteEditor } from '~/components/note-editor'
import { fetchNote } from '~/utils/notes'

export const Route = createFileRoute('/_layout/archive_/$noteId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const note = await fetchNote({
      data: { noteId: params.noteId, statusFilter: 'archived' },
    })
    return {
      note,
    }
  },
})

function RouteComponent() {
  const { note } = Route.useLoaderData()
  const router = useRouter()

  const handleEditSuccess = () => {
    router.invalidate()
  }

  const tagIds = note.notesToTags?.map((noteToTag) => noteToTag.tag.id) || []

  return (
    <div className="mx-auto max-w-3xl p-6">
      <NoteEditor
        isArchived
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
