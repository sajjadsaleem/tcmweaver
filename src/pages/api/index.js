import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    try {
      // console.log('req: ' , req , 'res: ' , res)
      const directoryPath =`${process.cwd()}/public/cornish-vault`;
  
      const fileNames = await fs.readdir(directoryPath);
      const filesData = await Promise.all(
        fileNames.map(async (fileName) => {
          const filePath = path.join(directoryPath, fileName);
          const content = await fs.readFile(filePath, 'utf-8');
          return { fileName, content };
        })
      );
      // console.log('filesData: ' , filesData)
  
      res.status(200).json(filesData);
    } catch (error) {
      console.error('Error reading files:', error);
      res.status(500).json({ error: 'Failed to read files.' });
    }
  }