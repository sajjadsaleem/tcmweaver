import fs from 'fs/promises';
import path from 'path';

export default async function getTags(req, res) {
    try{
        const inputValue = req.query.q
        const inputValueArray = inputValue.split(',');
        // console.log('inputValueArray: ' , inputValueArray)

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
    }catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
          }



}