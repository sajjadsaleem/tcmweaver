import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as drizzleSql } from "drizzle-orm";
import _ from 'lodash';
import { vaultsTable } from '../../db/schema/vaults';
import { eq, lt, gte, ne } from "drizzle-orm";
import { Fzf } from 'fzf';
import pg from 'pg';

// const { Pool } = pg;

// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// })


export default async function wanderNode(req, res) {
    if (req.method === 'GET') {

        try {
            const tableNamesStr = req.query.av
            const tableNames = tableNamesStr.split(',');
            const wordsArrayRaw = req.query.q.split(',');
            const uniqueWordsSet = new Set(wordsArrayRaw);
            const wordsArray = Array.from(uniqueWordsSet);
            const inputValue = req.query.sa.replace(/,/g, ' ');
            const backlinksValueCheck = req.query.bl
            // console.log('backlinksValueCheck', backlinksValueCheck)
            // console.log('req inputValue:', inputValue);
            const inputWalueCheck = req.query.sa.split(',');
            // console.log('req graph input check: ', inputWalueCheck)
            // console.log('tableNames', tableNames);

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

            // console.log('datasets', datasets.length)
            // console.log('rows nnowowerjwelrj', rows)

            // Remove ".md" extension
            const extensionRemovedData = datasets.map(item => {
                return {
                    ...item,
                    fileName: item.filename.replace(/\.md$/, '')
                };
            });

            // code to get backlinks
            const dataToCheckBacklinks = _.cloneDeep(extensionRemovedData)
            console.log('dataToCheckBacklinks', dataToCheckBacklinks.length)

            const escapedWord = backlinksValueCheck.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\[\\[${escapedWord}\\]\\]`);
            console.log('regex to check backlinks', regex)

            const filteredObjectsForBacklinks = dataToCheckBacklinks.filter(obj => regex.test(obj.content));
            console.log('filteredObjectsForBacklinks', filteredObjectsForBacklinks)

            let updatedObjectsForBacklinks = filteredObjectsForBacklinks.map((obj) => {
                // Extract the first word after '#' from the content using a regular expression
                const match = obj.content.match(/#(\w+)/);
                const tag = match ? match[1] : null;

                // console.log('tag', tag)

                // Add the 'tag' property to the object
                return {
                    ...obj,
                    tag: tag || 'file not found',
                };
            });

            const filteredWords = inputWalueCheck.filter(word => word.startsWith('-'));

            for (let i = 0; i < filteredWords.length; i++) {
                if (filteredWords[i].startsWith("-")) {
                    filteredWords[i] = filteredWords[i].substring(1);
                }
            }

            // console.log('filteredWords', filteredWords)

            updatedObjectsForBacklinks = updatedObjectsForBacklinks.filter(obj => {
                const tag = obj.tag.toLowerCase().replace(/^#/, '');;

                if (filteredWords.includes(`#${tag}`)) {
                    return false;
                }

                return true;
            });



            // console.log('extensionRemovedData', extensionRemovedData)

            const matchedObjects = _.filter(extensionRemovedData, (obj) =>
                wordsArray.includes(obj.fileName)
            );

            const missingFilenames = wordsArray.filter((filename) =>
                !matchedObjects.some((obj) => obj.fileName === filename)
            );

            // console.log('missingFilenames', missingFilenames)

            const missingObjects = missingFilenames.map((filename) => ({ fileName: filename, content: '', tag: 'file not found' }));

            const finalObjects = [...matchedObjects, ...missingObjects];

            // console.log('finalobjects', typeof finalObjects)

            // adding tag to the results
            let updatedObjects = finalObjects.map((obj) => {
                // Extract the first word after '#' from the content using a regular expression
                const match = obj.content.match(/#(\w+)/);
                const tag = match ? match[1] : null;

                // console.log('tag', tag)

                // Add the 'tag' property to the object
                return {
                    ...obj,
                    tag: tag || 'file not found',
                };
            });

            // const filteredWords = inputWalueCheck.filter(word => word.startsWith('-'));

            // for (let i = 0; i < filteredWords.length; i++) {
            //     if (filteredWords[i].startsWith("-")) {
            //         filteredWords[i] = filteredWords[i].substring(1);
            //     }
            // }

            // console.log('filteredWords', filteredWords)

            updatedObjects = updatedObjects.filter(obj => {
                const tag = obj.tag.toLowerCase().replace(/^#/, '');;

                if (filteredWords.includes(`#${tag}`)) {
                    return false;
                }

                return true;
            });

            // console.log('Updated filtered objects:', updatedObjects);

            res.status(200).json({
                updatedObjects: updatedObjects,
                updatedObjectsForBacklinks: updatedObjectsForBacklinks
            });
        }
        catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}