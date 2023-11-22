import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as drizzleSql } from "drizzle-orm";
import { eq, lt, gte, ne } from "drizzle-orm";

export default async function linkFile(req, res) {
    try {
        const inputValue = `${req.query.q}.md`
        const tableNamesStr = req.query.av
        const tableNames = tableNamesStr.split(',');
        console.log('inputValue: ', inputValue)
        console.log('tableNames', tableNames)

        const db = drizzle(sql)
        const datasets = []

        for (const tableName of tableNames) {
            // let datasets = await db.select().from(dataset).where(eq(dataset.filename, inputValue));
            console.log(inputValue, tableName)
            const selectQuery = drizzleSql`SELECT * FROM `;
            const selectQueryJoint = `${tableName} where filename = '${inputValue}'`
            selectQuery.queryChunks[0].value[0] += selectQueryJoint
            var dataFromVaultAccess = await db.execute(drizzleSql`${selectQuery}`);
            // console.log(dataFromVaultAccess.rows[0])
            if (dataFromVaultAccess.rows[0]) {
                datasets.push(dataFromVaultAccess.rows[0])
            }
        }

        console.log('datasets new', datasets)

        const updatedDatasets = datasets.map((firstRow) => {
            const dotIndex = firstRow.filename.lastIndexOf('.');
            if (dotIndex !== -1) {
                const fileNameWithoutExtension = firstRow.filename.substring(0, dotIndex);
                return {
                    ...firstRow,
                    fileName: fileNameWithoutExtension
                };
            } else {
                return firstRow; // No extension found, leave it as is
            }
        });

        // console.log('updatedDatasets', updatedDatasets)

        const updatedObject = updatedDatasets.reduce((result, dataset) => {
            const { id, filename, ...rest } = dataset;
            result.dataset = { filename: dataset.fileName, ...rest };
            return result;
        }, {});

        const desiredFormat = {
            fileName: updatedObject.dataset.filename,
            content: updatedObject.dataset.content
        };

        // console.log('desiredFormat', desiredFormat)

        res.status(200).json(desiredFormat);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }



}