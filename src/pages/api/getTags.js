import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dataset } from '../../db/schema/dataset'


export default async function getTags(req, res) {
    try {
        const inputValue = req.query.q
        const inputValueArray = inputValue.split(',');
        console.log('inputValueArray: ', inputValueArray)

        const db = drizzle(sql)
        // const datasets = await prisma.dataset.findMany({
        //     select: {
        //         filename: true,
        //         content: true,
        //         // Add other columns you want to include here
        //     },
        // });

        const datasets = await db.select().from(dataset);

        // Remove ".md" extension
        const extensionRemovedData = datasets.map(item => {
            return {
                ...item,
                fileName: item.filename.replace(/\.md$/, '')
            };
        });

        // console.log('extensionRemovedData' , extensionRemovedData)

        // filter the data
        const result = {};

        // Iterate through each word in inputValue
        inputValueArray.forEach((word) => {
            // Search for the word in extensionRemovedData
            const foundItem = extensionRemovedData.find((item) => item.fileName === word);

            // If a matching item is found, extract the content
            if (foundItem) {
                const content = foundItem.content;

                // Extract words starting with "#" from the content
                const hashTags = content.match(/#[^\s#]+/g);

                // Create an object entry for each word starting with "#"
                if (hashTags) {
                    hashTags.forEach((tag) => {
                        result[word] = tag.replace('#', '');
                    });
                }
            }
        });

        // console.log(result);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }

}