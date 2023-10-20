ALTER TABLE "userPackages" DROP CONSTRAINT "userPackages_user_id_package_id_unique";--> statement-breakpoint
ALTER TABLE "vaultPackages" DROP CONSTRAINT "vaultPackages_user_id_package_id_unique";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userPackages" ADD CONSTRAINT "userPackages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userPackages" ADD CONSTRAINT "userPackages_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultPackages" ADD CONSTRAINT "vaultPackages_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultPackages" ADD CONSTRAINT "vaultPackages_user_id_vaults_id_fk" FOREIGN KEY ("user_id") REFERENCES "vaults"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
