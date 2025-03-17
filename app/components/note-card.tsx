import { Link } from '@tanstack/react-router'
import { type InferSelectModel } from 'drizzle-orm'
import { type notes } from '~/db/schema'
import { cn } from '~/lib/utils'

type Note = InferSelectModel<typeof notes> & {
  notesToTags: Array<{
    id: string
    tag: {
      name: string
    }
  }>
}

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      key={note.id}
      to={note.isArchived ? '/archive/$noteId' : '/notes/$noteId'}
      params={{ noteId: note.id }}
      className={cn(
        'block rounded-lg p-4 transition-shadow hover:shadow-lg',
        note.isArchived
          ? 'border-2 border-dashed border-gray-400 dark:border-gray-600'
          : 'border border-solid border-border',
      )}
    >
      <h2 className="mb-2 text-lg font-semibold">{note.title}</h2>
      <p className="line-clamp-3 text-gray-600 dark:text-gray-400">
        {note.content}
      </p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <div className="flex gap-1">
          {note.notesToTags?.map((noteToTag) => (
            <span
              key={noteToTag.id}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
            >
              {noteToTag.tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
