import {
    integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text,
    timestamp, time
} from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    role_id: integer('role_id'),
    full_name: varchar('full_name', { length: 255 }),
    username: varchar('username', { length: 255 }),
    email: varchar('email', { length: 255 }),
    password: varchar('password', { length: 255 }),
    status: varchar('status', { length: 255 }),
    verification_token: text('verification_token'),
    forgot_password_token: text('forgot_password_token'),
}, (users) => {
    return {
        emailIndex: uniqueIndex('email').on(users.email),
    }
});