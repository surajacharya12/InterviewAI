import { integer, pgTable, varchar, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionId: varchar("subscriptionId"),
});

export const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy:varchar("createdBy").notNull(),
  createdAt:varchar("createdAt").notNull(),
  mockId: varchar("mockId").notNull(),
});

export const mockInterviewEnrollmentsTable = pgTable("mockInterviewEnrollments", {
  id: serial("id").primaryKey(),
  mockId: varchar("mockId").notNull(),
  userEmail: varchar("userEmail").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const UserAnswer=pgTable("userAnswer",{
  id:serial("id").primaryKey(),
  mockIdRef:varchar("mockId").notNull(),
  question:varchar("question").notNull(),
  correctanswer:varchar("Correctanswer").notNull(),
  useranswer:text("userAns"),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar("userEmail"),
  createdAt:varchar("createdAt")
})