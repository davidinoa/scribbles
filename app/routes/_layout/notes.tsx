import { createFileRoute } from '@tanstack/react-router'
import { NoteCard } from '~/components/note-card'
import { fetchNotes } from '~/utils/notes'

export const Route = createFileRoute('/_layout/notes')({
  loader: async () => {
    const notes = await fetchNotes({ data: false })
    return {
      notes,
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: NotesPage,
  shouldReload: true,
  pendingMs: 0,
  pendingMinMs: 5_000,
  preload: false,
})

function NotesPage() {
  const { notes } = Route.useLoaderData()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
