import {
  createFileRoute,
  retainSearchParams,
  useNavigate,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { EmptyState } from '~/components/empty-state'
import { NoteCard } from '~/components/note-card'
import { Input } from '~/components/ui/input'
import { fetchNotes } from '~/utils/notes'

export const Route = createFileRoute('/_layout/notes')({
  component: NotesPage,

  loaderDeps: ({ search }) => ({
    filterBy: search.filterBy,
  }),
  loader: async ({ deps }) => {
    const notes = await fetchNotes({ data: { filterBy: deps.filterBy } })
    return {
      notes,
    }
  },
})

function NotesPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { notes } = Route.useLoaderData()
  const search = Route.useSearch()
  const [filterDraft, setFilterDraft] = useState(search.filterBy ?? '')

  useEffect(() => {
    setFilterDraft(search.filterBy ?? '')
  }, [search.filterBy])

  useEffect(() => {
    navigate({
      search: (old) => ({
        ...old,
        filterBy: filterDraft || undefined,
      }),
      replace: true,
    })
  }, [filterDraft])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Notes</h1>
      <Input
        type="search"
        placeholder="Search notes"
        className="mb-4"
        value={filterDraft}
        onChange={(e) => setFilterDraft(e.target.value)}
      />
      {notes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No notes found"
          filterActive={!!search.filterBy}
          filterMessage="No notes match your search criteria. Try a different search term."
          defaultMessage="You haven't created any notes yet. Start by creating your first note."
        />
      )}
    </div>
  )
}
