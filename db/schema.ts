import {pgTable, timestamp, uuid, text} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    role: text('role').notNull().default('student'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})