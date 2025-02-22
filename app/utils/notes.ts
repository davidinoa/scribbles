import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { notes } from "~/db/schema";

export type NoteType = typeof notes.$inferSelect;

export const fetchNote = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: noteId }) => {
    console.info(`Fetching note with id ${noteId}...`);
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    if (!note) {
      throw notFound();
    }

    return note;
  });

export const fetchNotes = createServerFn({ method: "GET" }).handler(
  async () => {
    console.info("Fetching notes...");
    return db.query.notes.findMany({
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    });
  }
);
