import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { Button } from '~/components/ui/button'
import { deleteNote, fetchNote } from '~/utils/notes'
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
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { format } from 'date-fns'
import { Archive, Trash2 } from 'lucide-react'
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

  const handleDelete = async () => {
    await deleteNoteFn({ data: note.id })
    router.navigate({ to: '/notes' })
  }

  const handleArchive = async () => {
    await archiveNoteFn({ data: note.id })
    router.navigate({ to: '/notes' })
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="text-sm text-muted-foreground mt-2">
            Created {format(new Date(note.createdAt), 'PPP')}
          </div>
          {note.notesToTags?.length > 0 && (
            <div className="flex gap-1.5 mt-4">
              {note.notesToTags.map((noteToTag) => (
                <span
                  key={noteToTag.id}
                  className="px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                >
                  {noteToTag.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p>{note.content}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-6 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
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
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
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
      </CardFooter>
    </Card>
  )
}
