import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, unique } from 'drizzle-orm/pg-core';
import { users } from './users';
import { packagesTable } from './packages';

export const userPackagesTable = pgTable('userPackages', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').references(() => users.id),
    package_id: integer('package_id'),
    stripe_subscription_id: integer('stripe_subscription_id')
});