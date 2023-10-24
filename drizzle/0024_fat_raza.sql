ALTER TABLE "vaultPackages" RENAME COLUMN "user_id" TO "vault_id";--> statement-breakpoint
ALTER TABLE "vaultPackages" DROP CONSTRAINT "vaultPackages_user_id_vaults_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vaultPackages" ADD CONSTRAINT "vaultPackages_vault_id_vaults_id_fk" FOREIGN KEY ("vault_id") REFERENCES "vaults"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
