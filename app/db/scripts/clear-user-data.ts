import { db } from '../config'
import { notes, notesToTags, tags } from '../schema'
import { eq, inArray } from 'drizzle-orm'

async function main() {
  try {
    // Get the user ID from command line arguments
    const userId = process.argv[2]

    // Require a user ID to be provided
    if (!userId) {
      console.error('Error: User ID is required')
      console.error('Usage: pnpm run db:clear <user_id>')
      process.exit(1)
    }

    console.log(`Clearing data for user ID: ${userId}`)
    console.log('Note: Only data for this specific user will be affected')

    // First get note IDs for this user
    const userNotes = await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
    const userNoteIds = userNotes.map((note) => note.id)

    // Delete junction table entries that reference user's notes
    if (userNoteIds.length > 0) {
      await db
        .delete(notesToTags)
        .where(inArray(notesToTags.noteId, userNoteIds))
    }

    // Delete user's notes and tags
    const notesDeleted = await db.delete(notes).where(eq(notes.userId, userId))
    const tagsDeleted = await db.delete(tags).where(eq(tags.userId, userId))

    console.log(`✅ Data cleared successfully:`)
    console.log(`- Removed ${userNoteIds.length} notes`)
    console.log(`- Removed related tags and note-tag relationships`)
  } finally {
    await db.$client.end()
  }
}

main().catch((err) => {
  console.error('❌ Data clearing failed:', err)
  db.$client.end().finally(() => {
    process.exit(1)
  })
})
