import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const dataset = pgTable('dataset', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (dataset) => {
    return {
        filenameIndex: uniqueIndex('filename').on(dataset.filename),
    }
});