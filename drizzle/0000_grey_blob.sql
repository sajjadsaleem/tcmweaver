CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer,
	"full_name" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"status" varchar(255),
	"verification_token" text,
	"forgot_password_token" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email" ON "users" ("email");