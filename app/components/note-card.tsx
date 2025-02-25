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
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className={cn(
        'block rounded-lg p-4 hover:shadow-lg transition-shadow',
        note.isArchived
          ? 'border-2 border-dashed border-gray-400 dark:border-gray-600'
          : 'border border-solid border-border',
      )}
    >
      <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
        {note.content}
      </p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <div className="flex gap-1">
          {note.notesToTags?.map((noteToTag) => (
            <span
              key={noteToTag.id}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
            >
              {noteToTag.tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
