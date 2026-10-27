import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, unique } from 'drizzle-orm/pg-core';
import { packagesTable } from './packages';
import { vaultsTable } from './vaults';

export const vaultPackagesTable = pgTable('vaultPackages', {
    id: serial('id').primaryKey(),
    package_id: integer('package_id').references(() => packagesTable.id),
    vault_id: integer('vault_id').references(() => vaultsTable.id),
});