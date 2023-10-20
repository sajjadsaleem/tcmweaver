import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { dataset } from '../../db/schema/dataset'
import { filtersTable } from '../../db/schema/filters'
import { vaultsTable } from '../../db/schema/vaults';
import { eq, lt, gte, ne } from "drizzle-orm";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})



export default async function handler(req, res) {


    // console.log('req', req.query)

    const reqData = [];

    for (let i = 0; req.query[`folderId[${i}][kind]`]; i++) {
        const folderId = req.query[`folderId[${i}][id]`]
        const name = req.query[`folderId[${i}][name]`];
        const option = req.query[`folderId[${i}][option]`];
        reqData.push({ folderId, name, option });
    }

    // console.log('reqData', reqData);

    async function downloadFilesInFolder(folderId) {
        const CLIENT_ID = process.env.CLIENT_ID
        const CLIENT_SECRET = process.env.CLIENT_SECRET
        const REDIRECT_URI = process.env.REDIRECT_URI
        const ACCESS_TOKEN = req.headers.authorization.replace("Bearer ", "");

        const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
        oAuth2Client.setCredentials({ access_token: ACCESS_TOKEN });

        const drive = google.drive({ version: 'v3', auth: oAuth2Client });


        const filesResponse = await drive.files.list({
            q: `'${folderId}' in parents and mimeType='text/markdown'`,
        });
        // console.log('fileresponse', filesResponse.data.files)

        const files = filesResponse.data.files;

        return files;
    }

    async function processFolders(reqData) {
        const results = [];



        // console.log('folder', reqData)
        for (const folder of reqData) {
            // console.log('folder', folder)
            const folderId = folder.folderId;

            const downloadedFiles = await downloadFilesInFolder(folderId);
            // console.log('downloadedFiles', downloadedFiles)
            results.push({ name: folder.name, option: folder.option, downloadedFiles });
        }
        // console.log('results', results[1].downloadedFiles)

        // console.log('results', results.downloadedFiles)

        return results;
    }


    if (req.method === "GET") {
        try {
            const db = drizzle(sql)

            let results = await processFolders(reqData)


            // console.log('results', results)



            // const folderId = req.query.folderId;

            // const filesResponse = await drive.files.list({
            //     q: `'${folderId}' in parents and mimeType='text/markdown'`,
            // });

            // const files = filesResponse.data.files;
            // console.log('files: ', files)

            // const deletedData = await db.delete(basicVault);

            async function overwriteVault(files) {
                console.log('files1', files)
                const client = await pool.connect();

                const tableName = await db.select().from(vaultsTable)
                    .where(eq(vaultsTable.vault_name, files.option));

                console.log('tablename', tableName)
                // const tableName = files.option;
                const data = files.downloadedFiles

                const deleteQuery = `DELETE FROM ${tableName[0].reference_table}`;


                const result = await client.query(deleteQuery);

                const downloadedFilesFromDrive = [];


                for (const file of data) {
                    const fileId = file.id;
                    const fileName = file.name;
                    // console.log('fileid', fileId, 'filename', fileName)

                    const ACCESS_TOKEN = req.headers.authorization.replace("Bearer ", "");

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
                const client = await pool.connect();

                // console.log('files', files)

                const newTableId = await db.insert(vaultsTable).values({ vault_name: files.name, price: 0.00 })
                    .returning({ id: vaultsTable.id });
                const newTable = await db.update(vaultsTable).set({ reference_table: `table${newTableId[0].id}` })
                    .where(eq(vaultsTable.id, newTableId[0].id)).returning({ reference_table: vaultsTable.reference_table })
                // console.log()
                // console.log('result', result[0].id)

                const vaultSchema = {
                    id: 'SERIAL PRIMARY KEY',
                    filename: 'TEXT',
                    content: 'TEXT',
                };

                const tableName = newTable[0].reference_table;
                const data = files.downloadedFiles


                // const checkTables = `SELECT vault_name from vaults`
                // const allVaults = await client.query(checkTables);
                // console.log('allVaults', allVaults.rows)

                // const vaultExists = allVaults.rows.some((vault) => vault.vault_name === formattedTableName);

                const downloadedFilesFromDrive = [];

                // if (vaultExists) {

                //     // const createTableQuery = `CREATE TABLE IF NOT EXISTS ${formattedTableName} (
                //     //     ${Object.entries(vaultSchema)
                //     //         .map(([column, type]) => `${column} ${type}`)
                //     //         .join(', ')}
                //     //     )
                //     // `;

                //     // const insertQuery = `INSERT INTO vaults (vault_name) VALUES ($1)`;
                //     // const values = [formattedTableName];

                //     // // Execute the insert query with parameterized values
                //     // await client.query(insertQuery, values);


                //     // const result = await client.query(createTableQuery);
                //     // console.log('query ran', createTableQuery)

                //     // const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

                //     // Execute the create table query


                //     const deleteQuery = `DELETE FROM ${formattedTableName}`;


                //     const result = await client.query(deleteQuery);




                //     for (const file of data) {
                //         const fileId = file.id;
                //         const fileName = file.name;
                //         // console.log('fileid', fileId, 'filename', fileName)

                //         const ACCESS_TOKEN = req.headers.authorization.replace("Bearer ", "");

                //         try {
                //             const response = await axios({
                //                 method: 'get',
                //                 url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                //                 responseType: 'stream',
                //                 headers: {
                //                     Authorization: `Bearer ${ACCESS_TOKEN}`,
                //                 },
                //             });

                //             let content = '';

                //             response.data.on('data', (chunk) => {
                //                 content += chunk.toString();
                //             });

                //             await new Promise((resolve) => {
                //                 response.data.on('end', async () => {
                //                     console.log(`Downloaded file ${fileName}`);

                //                     const insertQuery = `INSERT INTO ${formattedTableName} (filename, content) VALUES ($1, $2)`;
                //                     const values = [fileName, content];

                //                     await client.query(insertQuery, values);


                //                     // const insertedFile = await db.insert(basicVault)
                //                     //     .values({ filename: fileName, content: content })

                //                     downloadedFilesFromDrive.push({
                //                         filename: fileName,
                //                         content: content,
                //                     });
                //                     resolve();
                //                 });
                //             });
                //         } catch (error) {
                //             console.error('Error fetching file:', error);
                //         }
                //     }

                //     console.log('downloadedFilesFromDrive', downloadedFilesFromDrive)
                //     return downloadedFilesFromDrive; // Return an array of downloaded files


                // } else {

                const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
                        ${Object.entries(vaultSchema)
                        .map(([column, type]) => `${column} ${type}`)
                        .join(', ')}
                        )
                    `;

                // const insertQuery = `INSERT INTO vaults (vault_name) VALUES ($1)`;
                // const values = [formattedTableName];

                // Execute the insert query with parameterized values
                // await client.query(insertQuery, values);


                const result = await client.query(createTableQuery);
                // console.log('query ran', result)

                // const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

                // Execute the create table query


                // const deleteQuery = `DELETE FROM ${tableName}`;


                // const result = await client.query(deleteQuery);




                for (const file of data) {
                    const fileId = file.id;
                    const fileName = file.name;
                    // console.log('fileid', fileId, 'filename', fileName)

                    const ACCESS_TOKEN = req.headers.authorization.replace("Bearer ", "");

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

                                const insertQuery = `INSERT INTO ${tableName} (filename, content) VALUES ($1, $2)`;
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

                console.log('downloadedFilesFromDrive', downloadedFilesFromDrive)
                return downloadedFilesFromDrive; // Return an array of downloaded files

            }
            // }



            try {
                let downloadedFiles = []

                for (const folder of results) {
                    if (folder.option === 'Create new vault') {
                        console.log('folder', folder)

                        downloadedFiles = [...downloadedFiles, ...await createNewVault(folder)];

                    } else {
                        downloadedFiles = [...downloadedFiles, ...await overwriteVault(folder)];
                    }
                }

                // console.log('downloadedfiles', downloadedFiles)
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