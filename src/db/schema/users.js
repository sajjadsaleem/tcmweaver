import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text, timestamp, time } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    role_id: integer('role_id'),
    // full_name: varchar('full_name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    password: varchar('password', { length: 255 }),
    // status: varchar('status', { length: 255 }),
    // avatar: text('avatar'),
    // verification_token: text('verification_token'),
    forgot_password_token: text('forgot_password_token'),
    // created_at: timestamp('created_at').notNull().default('now()'),
    // updated_at: timestamp('updated_at').notNull().default('now()'),
}, (users) => {
    return {
        emailIndex: uniqueIndex('email').on(users.email),
    }
});