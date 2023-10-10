import fs from 'fs/promises';
import path from 'path';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dataset } from '../../db/schema/dataset'

import { eq, lt, gte, ne, or } from "drizzle-orm";

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // console.log('req: ' , req , 'res: ' , res)
    // const directoryPath = `${process.cwd()}/public/cornish-vault`;

    // const fileNames = await fs.readdir(directoryPath);
    // const filesData = await Promise.all(
    //   fileNames.map(async (fileName) => {
    //     const filePath = path.join(directoryPath, fileName);
    //     const content = await fs.readFile(filePath, 'utf-8');
    //     return { fileName, content };
    //   })
    // );

    // Prisma Command
    // let dataset = await prisma.dataset.findUnique({
    //   where: {
    //     filename: "SAMPLE FILTERS.md",
    //   },
    //   select: {
    //     filename: true,
    //     content: true,
    //   },
    // });

    // Drizzle Command
    const db = drizzle(sql)
    let datasetArray = await db.select({
      filename: dataset.filename, content: dataset.content,
    }).from(dataset).where(
      or(
        eq(dataset.filename, 'SAMPLE FILTERS.md'),
        eq(dataset.filename, 'Home.md')
      )
    );

    const updatedDatasetArray = datasetArray.map(obj => {
      return {
        fileName: obj.filename,
        content: obj.content
        // Add other properties here if any
      };
    });

    console.log('udpatedarray', updatedDatasetArray)

    // console.log('updatedDatasetArray', updatedDatasetArray)
    // let datasetFilter = datasetArray[0] || null;

    // // console.log('datasetArray', datasetArray)



    // if (datasetFilter) {
    //   // Use path.basename to remove the extension from the filename

    //   // Update the dataset object to have 'fileName' property instead of 'filename'
    //   datasetFilter.fileName = datasetFilter.filename;

    //   // Delete the old 'filename' property
    //   delete datasetFilter.filename;

    //   datasetFilter = [datasetArray];
    // } else {
    //   datasetFilter = [];
    // }


    // // separate filters file and other data
    // // const filtersIndex = filesData.findIndex(item => item.fileName === "filters.md");
    // // const filtersObject = filtersIndex !== -1 ? filesData.splice(filtersIndex, 1)[0] : null;
    // // const filesWithoutFilters = filesData;
    // // const filesWithFilters = filtersObject ? [filtersObject] : [];
    // // // console.log("Files without filters:", filesWithoutFilters);
    // // console.log("Files with filters:", filesWithFilters);

    // console.log('datasetArray', datasetFilter)


    res.status(200).json(updatedDatasetArray);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files.' });
  }
}