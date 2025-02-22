import { createFileRoute } from "@tanstack/react-router";
import { fetchNotes } from "~/utils/notes";
import type { NoteType } from "~/utils/notes";

export const Route = createFileRoute("/notes")({
  loader: async () => {
    const notes = await fetchNotes();
    return {
      notes,
    };
  },
  component: NotesPage,
});

function NotesPage() {
  const { notes } = Route.useLoaderData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note: NoteType) => (
          <div
            key={note.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
              {note.content}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Status: {note.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
