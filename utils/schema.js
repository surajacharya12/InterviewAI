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

export const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId").notNull(), // maps to DB column "mockId"
  question: varchar("question").notNull(),
  correctanswer: varchar("Correctanswer").notNull(),
  useranswer: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
  
});

export const MyTakenInterview = pgTable("my_taken_interview", {
  id: serial("id").primaryKey(),
  mockId: varchar("mock_id").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: varchar("created_at").notNull(),
  jobPosition: varchar("job_position").notNull(),
  jobDesc: varchar("job_desc").notNull(),
  jobExperience: varchar("job_experience").notNull(),
});

export const InterviewQuestion = pgTable("interview_question", {
  id: serial("id").primaryKey(),
  mockId: varchar("mock_id", { length: 36 }).notNull().unique(), // UUID string
  jsonMockResp: text("json_mock_resp").notNull(), // JSON string of Q&A
  jobPosition: varchar("job_position", { length: 255 }).notNull(),
  jobDesc: varchar("job_desc", { length: 1000 }).notNull(),
  noOfQuestions: integer("no_of_questions").notNull(),
  createdBy:varchar("createdBy").notNull(),
});