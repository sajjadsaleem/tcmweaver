import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as drizzleSql } from "drizzle-orm";


export default async function getTags(req, res) {
    try {
        const inputValue = req.query.q
        const accessVaults = req.query.av
        const inputValueArray = inputValue.split(',');
        const tableNames = accessVaults.split(',');
        console.log('inputValueArray: ', inputValueArray)
        console.log('tablenames', tableNames)

        const db = drizzle(sql)

        let datasets = []

        for (const table of tableNames) {
            const selectQuery = drizzleSql`SELECT * FROM `;
            const selectQueryJoint = `${table}`
            selectQuery.queryChunks[0].value[0] += selectQueryJoint
            var dataFromVaultAccess = await db.execute(drizzleSql`${selectQuery}`);

            for (const item of dataFromVaultAccess.rows) {
                if (typeof item === 'object' && item !== null) {
                    datasets.push(item);
                }
            }
        }
        // console.log('rows nnowowerjwelrj', rows)

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
            } else {
                result[word] = 'tagnotfound'
            }
        });

        console.log(result);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }

}