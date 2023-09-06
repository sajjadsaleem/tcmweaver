import fs from 'fs/promises';
import path from 'path';

export default async function linkFile(req, res) {
    try{
        const inputValue = req.query.q
        // console.log('inputValue: ' , inputValue)

        // reading all files
        const directoryPath =`${process.cwd()}/public/cornish-vault`;
        const fileNames = await fs.readdir(directoryPath);
        const filesData = await Promise.all(
            fileNames.map(async (fileName) => {
            const filePath = path.join(directoryPath, fileName);
            const content = await fs.readFile(filePath, 'utf-8');
            return { fileName, content };
            })
        );

        // Remove ".md" extension
        const extensionRemovedData = filesData.map(item => {
            return {
            ...item,
            fileName: item.fileName.replace(/\.md$/, '') 
            };
        });

        // filter the data
        let filteredData = extensionRemovedData.filter(item => item.fileName === inputValue);
        filteredData = filteredData[0];

        res.status(200).json(filteredData);
    }catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
          }



}