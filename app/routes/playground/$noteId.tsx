import { createFileRoute } from '@tanstack/react-router'
import { NoteEditor } from '~/components/note-editor'
import { fetchNote } from '~/utils/notes'

export const Route = createFileRoute('/playground/$noteId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const note = await fetchNote({
      data: { noteId: params.noteId, statusFilter: 'active' },
    })
    return {
      note,
    }
  },
})

function RouteComponent() {
  const { note } = Route.useLoaderData()
  const tagIds = note.notesToTags?.map((noteToTag) => noteToTag.tag.id) || []
  return (
    <NoteEditor
      mode="edit"
      initialValues={{
        id: note.id,
        title: note.title,
        content: note.content || '',
        tags: tagIds,
        updatedAt: note.updatedAt || note.createdAt,
      }}
    />
  )
}
