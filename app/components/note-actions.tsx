import { Link } from '@tanstack/react-router'
import { Archive, ArrowLeft } from 'lucide-react'
import { DeleteNoteDialog } from '~/features/notes/components/delete-dialog'
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
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { ArchiveNoteDialog } from '~/features/notes/components/archive-dialog'

type NoteActionProps = {
  onAction: () => Promise<void>
  isArchived?: boolean
}

export function RestoreNoteDialog({ onAction }: NoteActionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2" size="sm">
          <Archive className="size-4" />
          <span className="sr-only">Restore</span>
          <span className="hidden md:block">Restore</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore this note?</AlertDialogTitle>
          <AlertDialogDescription>
            This note will be moved to your notes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Restore</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type ActionCallback = () => Promise<void>

export function NoteActions({
  onArchive,
  onDelete,
  isArchived,
  onRestore,
}: {
  onRestore: ActionCallback
  onArchive: ActionCallback
  onDelete: ActionCallback
  isArchived: boolean
}) {
  const backDestination = isArchived ? '/archive' : '/notes'
  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <Link to={backDestination} className="flex items-center gap-2 md:hidden">
        <ArrowLeft className="size-4" />
        Go back
      </Link>
      <div className="flex gap-2">
        {isArchived ? (
          <RestoreNoteDialog onAction={onRestore} />
        ) : (
          <ArchiveNoteDialog onAction={onArchive} />
        )}
        <DeleteNoteDialog onAction={onDelete} />
      </div>
    </div>
  )
}
