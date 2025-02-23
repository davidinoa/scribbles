import { Link } from '@tanstack/react-router'
import type { NoteType } from '~/utils/notes'

interface NoteCardProps {
  note: NoteType
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      key={note.id}
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
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
