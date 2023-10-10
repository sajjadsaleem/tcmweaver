import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const dataset = pgTable('Dataset', {
    id: serial('id').primaryKey(),
    filename: varchar('filename', { length: 256 }),
    content: varchar('content', { length: 256 }),
}, (dataset) => {
    return {
        filenameIndex: uniqueIndex('filename').on(dataset.filename),
    }
});