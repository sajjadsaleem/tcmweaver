import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, unique, text } from 'drizzle-orm/pg-core';
import { users } from './users';
import { vaultsTable } from './vaults'

export const userVaultsTable = pgTable('userVaults', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    vault_id: integer('vault_id'),
});