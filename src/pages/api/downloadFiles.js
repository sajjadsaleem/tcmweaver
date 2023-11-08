import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults';
import { eq, lt, gte, ne } from "drizzle-orm";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


export default async function handler(request, response) {

    async function downloadFilesInFolder(folderId) {
        const CLIENT_ID = process.env.CLIENT_ID
        const CLIENT_SECRET = process.env.CLIENT_SECRET
        const REDIRECT_URI = process.env.REDIRECT_URI
        const ACCESS_TOKEN = request.headers.authorization.replace("Bearer ", "");

        const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ access_token: ACCESS_TOKEN });

        const drive = google.drive({ version: 'v3', auth: oAuth2Client });

        const mimeType = 'text/markdown';
        let allFiles = [];


        async function listFiles(pageToken) {
            // console.log('folderid', folderId)
            const params = {
                q: `'${folderId}' in parents and mimeType='${mimeType}' and trashed=false`,
                fields: 'nextPageToken, files(id, name)',
                pageToken: pageToken || '',
            };

            const filesResponse = await drive.files.list(params);

            // console.log('filesresponse', filesResponse)



            const files = filesResponse.data.files;
            // console.log('files length ', files.length)

            allFiles = allFiles.concat(files);

            if (filesResponse.data.nextPageToken) {
                // If there are more files, make another API call with the next page token
                await listFiles(filesResponse.data.nextPageToken);
            } else {
                // All files have been retrieved
                // console.log('All files:', allFiles);

            }
            return allFiles
        }

        const allFilesToDownload = await listFiles();

        return allFilesToDownload

        // console.log('allfiles', allFiles.length)
    }

    async function processFolders(reqData) {
        const results = [];



        // console.log('folder', Data)
        for (const folder of reqData) {
            // console.log('folder', folder)
            const folderId = folder.folderId;

            const downloadedFiles = await downloadFilesInFolder(folderId);
            // console.log('downloadedFiles', downloadedFiles.length)
            results.push({ name: folder.name, option: folder.option, downloadedFiles });
        }
        // console.log('results', results[1].downloadedFiles)

        // console.log('results', results.downloadedFiles)

        return results;
    }


    if (request.method === "GET") {

        const reqData = [];

        for (let i = 0; request.query[`folderId[${i}][kind]`]; i++) {
            const folderId = request.query[`folderId[${i}][id]`]
            const name = request.query[`folderId[${i}][name]`];
            const option = request.query[`folderId[${i}][option]`];
            reqData.push({ folderId, name, option });
        }

        try {
            const db = drizzle(sql)

            let results = await processFolders(reqData)


            // console.log('results', results)

            response.status(200).json({
                message: `${results[0].downloadedFiles.length} files detected`,
                data: results
            });













        } catch (error) {
            console.error("Error fetching file:", error.message);
            response.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        response.status(405).end(); // Method Not Allowed
    }
}

