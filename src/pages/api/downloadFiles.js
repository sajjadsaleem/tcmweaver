import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
const path = require('path');
const fs = require('fs');
import { Readable } from 'stream';
import axios from 'axios';

export default async function handler(req, res) {



    if (req.method === "GET") {
        try {
            const CLIENT_ID = process.env.CLIENT_ID
            const CLIENT_SECRET = process.env.CLIENT_SECRET
            const REDIRECT_URI = process.env.REDIRECT_URI
            const ACCESS_TOKEN = req.headers.authorization.replace("Bearer ", "");

            const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            oAuth2Client.setCredentials({ access_token: ACCESS_TOKEN });

            const drive = google.drive({ version: 'v3', auth: oAuth2Client });

            const folderId = req.query.folderId;

            const filesResponse = await drive.files.list({
                q: `'${folderId}' in parents`,
            });

            const files = filesResponse.data.files;
            console.log('files: ', files)


            for (const file of files) {
                const fileId = file.id;
                const fileName = file.name;

                // Download the file
                const response = await axios({
                    method: 'get',
                    url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                    responseType: 'stream',
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                });

                // Save the file to a local directory (e.g., 'public/cornish-vault')
                const publicFolderPath = path.join(process.cwd(), 'public/cornish-vault');

                const filePath = `${publicFolderPath}/${fileName}`;

                const writableStream = fs.createWriteStream(filePath);

                response.data.pipe(writableStream);

                await new Promise((resolve, reject) => {
                    writableStream.on('finish', resolve);
                    writableStream.on('error', reject);
                });

                console.log(`File saved: ${filePath}`);
            }

            return res.status(200).json({ message: 'Files downloaded successfully' });

            // const fileId = '1MM9n72XWn0VdlIwoqb55PdjX1iqn9TGh';

            // const response = await axios({
            //     method: 'get',
            //     url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            //     responseType: 'stream', // Important: Set the responseType to 'stream'
            //     headers: {
            //         Authorization: `Bearer ${ACCESS_TOKEN}`,
            //     },
            // });

            // const publicFolderPath = path.join(process.cwd(), 'public/cornish-vault');
            // const filePath = path.join(publicFolderPath, 'Tuna Melt.md');

            // const writableStream = fs.createWriteStream(filePath);

            // response.data.pipe(writableStream);

            // response.data.on('end', () => {
            //     console.log("File saved:", filePath);
            //     return res.status(200).json({ filePath });
            // });

            // response.data.on('error', (error) => {
            //     console.error("Error fetching files:", error.message);
            //     res.status(500).json({ error: "Internal Server Error" });
            // });
            // return res.status(200).json({ response });

        } catch (error) {
            console.error("Error fetching files:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}