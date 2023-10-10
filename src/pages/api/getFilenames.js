import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dataset } from '../../db/schema/dataset'
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export default async function getTags(req, res) {
    if (req.method === 'GET') {
        try {
            // const datasets = await prisma.dataset.findMany({
            //     select: {
            //         filename: true,
            //         // Add other columns you want to include here
            //     },
            // });

            const db = drizzle(sql)
            const datasets = await db.select({ filename: dataset.filename }).from(dataset);
            // console.log('datasets', datasets)

            // Remove ".md" extension
            const extensionRemovedData = datasets.map(item => {
                return {
                    ...item,
                    fileName: item.filename.replace(/\.md$/, '')
                };
            });

            res.status(200).json({ extensionRemovedData });
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}