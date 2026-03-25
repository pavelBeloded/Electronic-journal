import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  time,
  pgEnum,
  uniqueIndex,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["headman", "student"]);
export const weekTypeEnum = pgEnum("week_type", ["all", "even", "odd"]);
export const subgroupEnum = pgEnum("subgroup", ["all", "1", "2"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique("students_user_id_unique"),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),

  fullName: text("full_name").notNull(),

  subgroup: subgroupEnum("subgroup").notNull().default("all"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduleEntries = pgTable("schedule_entries", {
  id: uuid("id").defaultRandom().primaryKey(),

  type: text("type"),

  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),

  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),

  weekday: integer("weekday").notNull(), // 1 = Monday ... 7 = Sunday
  lessonNumber: integer("lesson_number").notNull(),

  weekType: weekTypeEnum("week_type").notNull().default("all"),
  subgroup: subgroupEnum("subgroup").notNull().default("all"),

  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),

  room: text("room"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const absences = pgTable(
  "absences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    scheduleEntryId: uuid("schedule_entry_id")
      .notNull()
      .references(() => scheduleEntries.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    isExcused: boolean("is_excused").notNull().default(false),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueAbsence: uniqueIndex("absences_student_schedule_date_unique").on(
      table.studentId,
      table.scheduleEntryId,
      table.date,
    ),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  students: many(students),
  scheduleEntries: many(scheduleEntries),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [students.groupId],
    references: [groups.id],
  }),
  absences: many(absences),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  scheduleEntries: many(scheduleEntries),
}));

export const scheduleEntriesRelations = relations(
  scheduleEntries,
  ({ one, many }) => ({
    group: one(groups, {
      fields: [scheduleEntries.groupId],
      references: [groups.id],
    }),
    subject: one(subjects, {
      fields: [scheduleEntries.subjectId],
      references: [subjects.id],
    }),
    absences: many(absences),
  }),
);

export const absencesRelations = relations(absences, ({ one }) => ({
  student: one(students, {
    fields: [absences.studentId],
    references: [students.id],
  }),
  scheduleEntry: one(scheduleEntries, {
    fields: [absences.scheduleEntryId],
    references: [scheduleEntries.id],
  }),
}));
