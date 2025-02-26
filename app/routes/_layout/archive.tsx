import {
  createFileRoute,
  retainSearchParams,
  useNavigate,
} from '@tanstack/react-router'
import { z } from 'zod'
import { NoteCard } from '~/components/note-card'
import { EmptyState } from '~/components/empty-state'
import { Input } from '~/components/ui/input'
import { fetchNotes } from '~/utils/notes'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/_layout/archive')({
  validateSearch: z.object({
    filterBy: z.string().optional(),
  }).parse,
  search: {
    middlewares: [retainSearchParams(['filterBy'])],
  },
  loaderDeps: ({ search }) => ({
    filterBy: search.filterBy,
  }),
  loader: async ({ deps }) => {
    const notes = await fetchNotes({
      data: {
        statusFilter: 'archived',
        filterBy: deps.filterBy,
      },
    })
    return {
      notes,
    }
  },
  pendingComponent: () => <div>Loading...</div>,
  component: ArchivePage,
})

function ArchivePage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()
  const { notes } = Route.useLoaderData()
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
      <h1 className="text-2xl font-bold mb-4">Archive</h1>
      <Input
        type="search"
        placeholder="Search archived notes"
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
          title="No archived notes"
          filterActive={!!search.filterBy}
          filterMessage="No archived notes match your search criteria. Try a different search term."
          defaultMessage="You don't have any archived notes. Notes you archive will appear here."
        />
      )}
    </div>
  )
}
