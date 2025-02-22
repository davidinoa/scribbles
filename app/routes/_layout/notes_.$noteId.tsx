import { createFileRoute } from '@tanstack/react-router'
import { fetchNote } from '~/utils/notes'

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
  return (
    <div>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </div>
  )
}
