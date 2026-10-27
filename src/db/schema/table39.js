import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const table39Table = pgTable('table39', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (table39) => {
    return {
        filenameIndex: uniqueIndex('filename').on(table39.filename),
    }
});