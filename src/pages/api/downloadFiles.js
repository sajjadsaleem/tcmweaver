import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
const path = require('path');
const fs = require('fs');
import { Readable } from 'stream';
import axios from 'axios';
import { sql } from "@vercel/postgres";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
                q: `'${folderId}' in parents and mimeType='text/markdown'`,
            });

            const files = filesResponse.data.files;
            console.log('files: ', files)
            async function downloadFiles(files) {
                const downloadedFiles = [];

                for (const file of files) {
                    const fileId = file.id;
                    const fileName = file.name;

                    try {
                        const response = await axios({
                            method: 'get',
                            url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                            responseType: 'stream',
                            headers: {
                                Authorization: `Bearer ${ACCESS_TOKEN}`,
                            },
                        });

                        let content = '';

                        response.data.on('data', (chunk) => {
                            content += chunk.toString();
                        });

                        await new Promise((resolve) => {
                            response.data.on('end', async () => {
                                console.log(`Downloaded file ${fileName}. File Content:`, content);

                                // const data = await prisma.someModel.findMany();

                                // console.log('data', data)

                                const insertedFile = await prisma.dataset.upsert({
                                    where: {
                                        filename: fileName, // Unique identifier
                                    },
                                    update: {
                                        content: content,
                                    },
                                    create: {
                                        filename: fileName,
                                        content: content,
                                    },
                                });

                                downloadedFiles.push({
                                    id: insertedFile.id,
                                    // fileName,
                                    content: content,
                                });
                                resolve();
                            });
                        });
                    } catch (error) {
                        console.error('Error fetching file:', error);
                    }
                }

                return downloadedFiles; // Return an array of downloaded files
            }


            try {
                const downloadedFiles = await downloadFiles(files);
                console.log('downloadedFiles = ', downloadedFiles.length)
                res.status(200).json({
                    message: `${downloadedFiles.length} files synchronized successfully`,
                    data: downloadedFiles
                });
            } catch (error) {
                console.error('Error during file download:', error);
                res.status(500).json({ message: 'Internal server error' });
            }

        } catch (error) {
            console.error("Error fetching files:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}