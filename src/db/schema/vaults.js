
import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text, numeric } from 'drizzle-orm/pg-core';

export const vaultsTable = pgTable('vaults', {
    id: serial('id').primaryKey(),
    vault_name: text('vault_name'),
    reference_table: text('reference_table'),
    user_id: integer("user_id"),
    price: numeric('price')
}, (vaults) => {
    return {
        filenameIndex: uniqueIndex('vault_name').on(vaults.vault_name),
    }
});