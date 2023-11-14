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

export const config = {
    maxDuration: 300,
};


export default async function handler(request, response) {

    if (request.method === "POST") {
        // console.log('request ', request.body.data, request.headers.authorization)

        try {
            const db = drizzle(sql)
            let client


            async function overwriteVault(files) {
                // console.log('files', files)
                client = await pool.connect();
                console.log('client', client)


                const tableName = await db.select().from(vaultsTable)
                    .where(eq(vaultsTable.vault_name, files.option));

                // console.log('tablename', tableName)
                // const tableName = files.option;
                const data = files.downloadedFiles

                // const deleteQuery = `DELETE FROM ${tableName[0].reference_table}`;


                // const result = await client.query(deleteQuery);

                const downloadedFilesFromDrive = [];


                for (const file of data) {
                    const fileId = file.id;
                    const fileName = file.name;
                    // console.log('fileid', fileId, 'filename', fileName)

                    const ACCESS_TOKEN = request.headers.authorization.replace("Bearer ", "");

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
                                console.log(`Downloaded file ${fileName}`);

                                const insertQuery = `INSERT INTO ${tableName[0].reference_table} (filename, content) VALUES ($1, $2)`;
                                const values = [fileName, content];

                                await client.query(insertQuery, values);


                                // const insertedFile = await db.insert(basicVault)
                                //     .values({ filename: fileName, content: content })

                                downloadedFilesFromDrive.push({
                                    filename: fileName,
                                    content: content,
                                });
                                resolve();
                            });
                        });
                    } catch (error) {
                        console.error('Error fetching file:', error);
                    }
                }

                return downloadedFilesFromDrive; // Return an array of downloaded files
            }

            async function createNewVault(files) {
                // console.log('files1', files)
                client = await pool.connect();

                const tableName = await db.select().from(vaultsTable)
                    .where(eq(vaultsTable.vault_name, files.name));

                console.log('tablename', tableName)
                // const tableName = files.option;
                const data = files.downloadedFiles

                // const deleteQuery = `DELETE FROM ${tableName[0].reference_table}`;


                // const result = await client.query(deleteQuery);

                const downloadedFilesFromDrive = [];


                for (const file of data) {
                    const fileId = file.id;
                    const fileName = file.name;
                    // console.log('fileid', fileId, 'filename', fileName)

                    const ACCESS_TOKEN = request.headers.authorization.replace("Bearer ", "");

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
                                console.log(`Downloaded file ${fileName}`);

                                const insertQuery = `INSERT INTO ${tableName[0].reference_table} (filename, content) VALUES ($1, $2)`;
                                const values = [fileName, content];

                                await client.query(insertQuery, values);


                                // const insertedFile = await db.insert(basicVault)
                                //     .values({ filename: fileName, content: content })

                                downloadedFilesFromDrive.push({
                                    filename: fileName,
                                    content: content,
                                });
                                resolve();
                            });
                        });
                    } catch (error) {
                        console.error('Error fetching file:', error);
                    }
                }

                return downloadedFilesFromDrive; // Return an array of downloaded files
            }

            let results = [request.body];
            // console.log('results', results)
            let downloadedFiles = []

            for (const folder of results) {
                if (folder.option === 'Create new vault') {
                    // console.log('folder', folder)

                    downloadedFiles = [...downloadedFiles, ...await createNewVault(folder)];

                } else {
                    console.log('folder', folder.downloadedFiles.length)
                    downloadedFiles = [...downloadedFiles, ...await overwriteVault(folder)];
                }
            }

            client.release()
            console.log('downloadedFiles = ', downloadedFiles.length)
            response.status(200).json({
                message: `${downloadedFiles.length} files synchronized successfully`,
            });




            try {

            } catch (error) {
                console.error('Error during file download:', error);
                response.status(500).json({ message: 'Internal server error' });
            }

        } catch (error) {
            console.error("Error fetching file:", error.message);
            response.status(500).json({ error: "Internal Server Error" });
        }

    } else {
        response.status(405).end(); // Method Not Allowed
    }
}

