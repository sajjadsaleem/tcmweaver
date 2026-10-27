import {
    integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text,
    timestamp, time
} from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    role_id: integer('role_id'),
    full_name: text('full_name'),
    username: varchar('username', { length: 255 }),
    email: text('email'), // Change to text
    password: text('password'),
    status: text('status'),
    image: text('image'),
    verification_token: text('verification_token'),
    forgot_password_token: text('forgot_password_token'),
    stripe_customer_id: text('stripe_customer_id'),
    session_id: text('session_id')
}, (users) => {
    return {
        emailIndex: uniqueIndex('email').on(users.email),
    }
});