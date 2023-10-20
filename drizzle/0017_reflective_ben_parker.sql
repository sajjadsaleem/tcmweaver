CREATE TABLE IF NOT EXISTS "packages" (
	"id" serial PRIMARY KEY NOT NULL,
	"package_name" text,
	"package_price" numeric,
	"vault_name" text,
	CONSTRAINT "packages_package_name_vault_name_unique" UNIQUE("package_name","vault_name")
);
