import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '~/components/empty-state'
import { NoteCard } from '~/components/note-card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { fetchNotes } from '~/utils/notes'

export const Route = createFileRoute('/_layout/notes')({
  component: NotesPage,
  loaderDeps: ({ search }) => ({
    filterBy: search.filterBy,
  }),
  loader: async ({ deps }) => ({
    notes: await fetchNotes({ data: { filterBy: deps.filterBy } }),
  }),
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

  const mobileView = (
    <div className="flex flex-col gap-4 md:hidden">
      <h1 className="mb-4 text-2xl font-bold">Notes</h1>
      <Input
        type="search"
        placeholder="Search notes"
        className="mb-4"
        value={filterDraft}
        onChange={(e) => setFilterDraft(e.target.value)}
      />
      <NoteList className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" />
    </div>
  )

  const desktopView = (
    <div className="hidden gap-4 md:grid">
      <Button className="flex w-fit items-center gap-2 bg-ds-blue-500 text-white transition-all hover:bg-ds-blue-700">
        <PlusIcon className="mr-2 size-4" />
        Create New Note
      </Button>
      <NoteList className="grid gap-4" />
    </div>
  )

  return (
    <div className="p-4">
      {mobileView}
      {desktopView}
    </div>
  )
}

export function NoteList({ className }: { className?: string }) {
  const { notes } = Route.useLoaderData()
  const search = Route.useSearch()

  const emptyState = (
    <EmptyState
      title="No notes found"
      filterActive={!!search.filterBy}
      filterMessage="No notes match your search criteria. Try a different search term."
      defaultMessage="You haven't created any notes yet. Start by creating your first note."
    />
  )
  return (
    <div className={cn('grid gap-4', className)}>
      {notes.length > 0
        ? notes.map((note) => <NoteCard key={note.id} note={note} />)
        : emptyState}
    </div>
  )
}
