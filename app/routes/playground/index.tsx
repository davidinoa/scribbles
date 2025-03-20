import { createFileRoute } from '@tanstack/react-router'
import { NoteEditor } from '~/components/note-editor'
export const Route = createFileRoute('/playground/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NoteEditor />
}
