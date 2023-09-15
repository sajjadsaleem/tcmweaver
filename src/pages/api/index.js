import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    // console.log('req: ' , req , 'res: ' , res)
    const directoryPath = `${process.cwd()}/public/cornish-vault`;

    const fileNames = await fs.readdir(directoryPath);
    const filesData = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(directoryPath, fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        return { fileName, content };
      })
    );

    // separate filters file and other data
    const filtersIndex = filesData.findIndex(item => item.fileName === "filters.md");
    const filtersObject = filtersIndex !== -1 ? filesData.splice(filtersIndex, 1)[0] : null;
    const filesWithoutFilters = filesData;
    const filesWithFilters = filtersObject ? [filtersObject] : [];
    // console.log("Files without filters:", filesWithoutFilters);
    // console.log("Files with filters:", filesWithFilters);


    res.status(200).json(filesWithFilters);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files.' });
  }
}