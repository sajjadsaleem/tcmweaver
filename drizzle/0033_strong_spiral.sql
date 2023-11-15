CREATE TABLE IF NOT EXISTS "userVaults" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"package_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userVaults" ADD CONSTRAINT "userVaults_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
