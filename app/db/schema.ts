import { sql } from 'drizzle-orm'
import {
  customType,
  index,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const createTable = pgTableCreator((name) => name)

const NANO_ID_LENGTH = 10

const nanoId = customType<{ data: string }>({
  dataType: () => `varchar(${NANO_ID_LENGTH})`,
  toDriver: (value: string) => value,
})

const createId = (name = 'id') =>
  nanoId(name)
    .notNull()
    .$default(() => nanoid(NANO_ID_LENGTH))

export const noteStatusEnum = pgEnum('note_status', [
  'draft',
  'published',
  'archived',
])

export const tags = createTable(
  'tag',
  {
    id: createId().primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    userId: varchar('user_id', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index('tag_name_idx').on(table.name),
    index('tag_user_id_idx').on(table.userId),
  ],
)

export const notes = createTable(
  'note',
  {
    id: createId().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content'),
    isArchived: boolean('is_archived').default(false).notNull(),
    userId: varchar('user_id', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => [
    index('note_title_idx').on(table.title),
    index('note_user_id_idx').on(table.userId),
  ],
)

export const notesToTags = createTable(
  'notes_to_tags',
  {
    id: createId().primaryKey(),
    noteId: createId('note_id')
      .notNull()
      .references(() => notes.id, {
        onDelete: 'cascade',
      }),
    tagId: createId('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index('note_id_idx').on(table.noteId),
    index('tag_id_idx').on(table.tagId),
  ],
)

// Relations
export const notesRelations = relations(notes, ({ many }) => ({
  notesToTags: many(notesToTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  notesToTags: many(notesToTags),
}))

export const notesToTagsRelations = relations(notesToTags, ({ one }) => ({
  note: one(notes, {
    fields: [notesToTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [notesToTags.tagId],
    references: [tags.id],
  }),
}))

export const insertNoteSchema = createInsertSchema(notes)
export const selectNoteSchema = createSelectSchema(notes)
export const insertTagSchema = createInsertSchema(tags)
export const selectTagSchema = createSelectSchema(tags)
