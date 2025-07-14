CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDesc" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar NOT NULL,
	"mockId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscriptionId" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "mockInterview" ADD CONSTRAINT "mockInterview_createdBy_users_email_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;