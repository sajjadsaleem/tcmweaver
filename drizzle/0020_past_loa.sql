CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"package_id" integer,
	CONSTRAINT "subscriptions_user_id_package_id_unique" UNIQUE("user_id","package_id")
);
