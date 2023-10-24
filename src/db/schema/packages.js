import { integer, pgEnum, pgTable, serial, uniqueIndex, text, numeric, unique } from 'drizzle-orm/pg-core';

export const packagesTable = pgTable('packages', {
    id: serial('id').primaryKey(),
    package_name: text('package_name'),
    package_price: numeric('package_price'),
    vault_name: text('vault_name'),
    api_id: text('api_id')
}, (packages) => {
    return {
        uniquePackages: unique().on(packages.package_name, packages.vault_name),
    }
});