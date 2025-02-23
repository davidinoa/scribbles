import { faker } from '@faker-js/faker'
import { db } from '../config'
import { notes, notesToTags, tags } from '../schema'
import type { InferInsertModel } from 'drizzle-orm'

type InsertTag = InferInsertModel<typeof tags>
type InsertNote = InferInsertModel<typeof notes>

async function main() {
  try {
    // Clear existing data
    await db.delete(notesToTags)
    await db.delete(notes)
    await db.delete(tags)

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
