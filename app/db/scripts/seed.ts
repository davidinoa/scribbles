import { faker } from '@faker-js/faker'
import { db } from '../config'
import { notes, notesToTags, tags } from '../schema'
import type { InferInsertModel } from 'drizzle-orm'
import { eq, inArray } from 'drizzle-orm'

type InsertTag = InferInsertModel<typeof tags>
type InsertNote = InferInsertModel<typeof notes>

async function main() {
  try {
    // Get the user ID from command line arguments
    const userId = process.argv[2]

    // Require a user ID to be provided
    if (!userId) {
      console.error('Error: User ID is required')
      console.error('Usage: pnpm run db:seed <user_id>')
      process.exit(1)
    }

    console.log(`Running seed for user ID: ${userId}`)
    console.log('Note: Only data for this specific user will be affected')

    // Replace any DELETE or TRUNCATE operations to filter by user ID
    // For example, if you have something like:
    // await db.delete(chats)
    // Change it to:
    // await db.delete(chats).where(eq(chats.userId, userId))

    // Same for other tables that have user relationships:
    // await db.delete(messages).where(eq(messages.userId, userId))
    // await db.delete(userSettings).where(eq(userSettings.userId, userId))
    // etc.

    // Clear existing data
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

    await db.delete(notes).where(eq(notes.userId, userId))
    await db.delete(tags).where(eq(tags.userId, userId))

    const tagNames = [
      'work',
      'personal',
      'ideas',
      'todo',
      'research',
      'meeting',
      'project',
      'learning',
      'important',
      'archive',
      'reference',
    ]

    const createdTags = await Promise.all(
      tagNames.map((name) =>
        db
          .insert(tags)
          .values({
            name,
            userId,
          } satisfies InsertTag)
          .returning()
          .then((res) => res[0]),
      ),
    )

    const NOTE_COUNT = 26
    const START_DATE = '2024-01-01'
    const END_DATE = '2025-01-01'

    const createdNotes = await Promise.all(
      Array.from({ length: NOTE_COUNT }, async () => {
        const randomDate = faker.date.between({
          from: START_DATE,
          to: END_DATE,
        })

        return db
          .insert(notes)
          .values({
            title: faker.helpers.arrayElement([
              faker.company.catchPhrase(),
              faker.hacker.phrase(),
              faker.lorem.sentence(3),
              `Meeting: ${faker.company.buzzPhrase()}`,
              `Project: ${faker.commerce.productName()}`,
              `Ideas for ${faker.company.buzzNoun()}`,
            ]),
            content: faker.lorem.paragraphs(3),
            isArchived: faker.datatype.boolean(),
            createdAt: randomDate,
            userId,
          } satisfies InsertNote)
          .returning()
          .then((res) => res[0])
      }),
    )

    // Randomly assign 1-3 tags to each note
    await Promise.all(
      createdNotes.map((note) => {
        const numberOfTags = faker.number.int({ min: 1, max: 3 })
        const selectedTags = faker.helpers.arrayElements(
          createdTags,
          numberOfTags,
        )

        return Promise.all(
          selectedTags.map((tag) =>
            db.insert(notesToTags).values({
              noteId: note.id,
              tagId: tag.id,
            }),
          ),
        )
      }),
    )

    console.log('🌱 Seeding completed')
  } finally {
    await db.$client.end()
  }
}

main().catch((err) => {
  console.error('😔 Seeding failed:', err)
  db.$client.end().finally(() => {
    process.exit(1)
  })
})
