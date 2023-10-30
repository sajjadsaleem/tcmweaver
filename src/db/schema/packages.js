import { integer, pgEnum, pgTable, serial, uniqueIndex, text, numeric, unique } from 'drizzle-orm/pg-core';

export const packagesTable = pgTable('packages', {
    id: serial('id').primaryKey(),
    name: text('name'),
    price: numeric('price'),
    stripe_prod_id: text('stripe_prod_id')
}, (packages) => {
    return {
        uniquePackages: unique().on(packages.name),
    }
});