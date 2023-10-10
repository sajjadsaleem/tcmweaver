import fs from 'fs/promises';
import path from 'path';

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dataset } from '../../db/schema/dataset'
import { eq, lt, gte, ne } from "drizzle-orm";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export default async function linkFile(req, res) {
    try {
        const inputValue = `${req.query.q}.md`
        console.log('inputValue: ', inputValue)

        // reading all files
        // const directoryPath =`${process.cwd()}/public/cornish-vault`;
        // const fileNames = await fs.readdir(directoryPath);
        // const filesData = await Promise.all(
        //     fileNames.map(async (fileName) => {
        //     const filePath = path.join(directoryPath, fileName);
        //     const content = await fs.readFile(filePath, 'utf-8');
        //     return { fileName, content };
        //     })
        // );

        // let dataset = await prisma.dataset.findUnique({
        //     where: {
        //         filename: inputValue,
        //     },
        //     select: {
        //         filename: true,
        //         content: true,
        //         // Add other columns you want to include here
        //     },
        // });

        const db = drizzle(sql)
        let datasets = await db.select().from(dataset).where(eq(dataset.filename, inputValue));
        // console.log('datasets new', datasets)

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

        console.log('desiredFormat', desiredFormat)




        // const fileNameWithoutExtension = path.basename(dataset.filename, path.extname(dataset.filename));

        // // Update the dataset object to have 'fileName' property instead of 'filename'
        // dataset.filename = fileNameWithoutExtension;
        // console.log('dataset', dataset)

        // if (dataset) {
        //     // Use path.basename to remove the extension from the filename

        //     // Update the dataset object to have 'fileName' property instead of 'filename'
        //     dataset.fileName = dataset.filename;

        //     // Delete the old 'filename' property
        //     delete dataset.filename;
        // }

        // // dataset = dataset.map(item => {
        // //     return {
        // //         ...item,
        // //         fileName: item.fileName.replace(/\.md$/, '')
        // //     };
        // // });

        // // Remove ".md" extension
        // // const extensionRemovedData = filesData.map(item => {
        // //     return {
        // //         ...item,
        // //         fileName: item.fileName.replace(/\.md$/, '')
        // //     };
        // // });

        // // filter the data
        // // let filteredData = extensionRemovedData.filter(item => item.fileName === inputValue);
        // // filteredData = filteredData[0];

        // console.log('dataset', dataset)

        res.status(200).json(desiredFormat);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }



}