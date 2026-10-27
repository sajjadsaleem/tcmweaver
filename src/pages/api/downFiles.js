import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql as drizzleSql, eq } from "drizzle-orm";
import { vaultsTable } from '../../db/schema/vaults';
import axios from 'axios';
const { Readable } = require('stream');
const { pipeline } = require('stream/promises');

export const config = {
    runtime: 'edge',
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function uploadFiles(results, req) {



    async function overwriteVault(files, request) {
        const db = drizzle(sql)
        console.log('now in overwrite folder')
        // console.log('request to download files', request)
        // console.log('files1', files)

        const tableNameToDelete = await db.select().from(vaultsTable)
            .where(eq(vaultsTable.vault_name, files.option));

        const data = files.downloadedFiles

        const tableToDelete = tableNameToDelete[0].reference_table

        var deleteQuery = drizzleSql`DELETE from `
        const newDeleteQuery = `${tableToDelete}`
        deleteQuery.queryChunks[0].value[0] += newDeleteQuery
        var dataDeleted = await db.execute(drizzleSql`${deleteQuery}`);

        const downloadedFilesFromDrive = [];
        const accessToken = request.headers.get('authorization')
        const ACCESS_TOKEN = accessToken.substring('Bearer '.length);

        async function processFile(file, ACCESS_TOKEN) {
            const fileId = file.id;
            const fileName = file.name;

            try {
                const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
                const headers = {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                };

                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch file ${fileName}. Status: ${response.status}`);
                }

                const chunks = [];
                let totalSize = 0;

                // Read data in chunks and accumulate in the buffer array
                for await (const chunk of response.body) {
                    chunks.push(chunk);
                    totalSize += chunk.length;
                }

                // Combine chunks into a single buffer
                const buffer = Buffer.concat(chunks, totalSize);

                const content = buffer.toString();
                // console.log('content', content);

                const userQuery = drizzleSql`INSERT INTO `;
                const tableColumns = `${tableToDelete} (filename, content) values ('${fileName}', '${content}')`;

                userQuery.queryChunks[0].value[0] += tableColumns;

                await db.execute(drizzleSql`${userQuery}`);
                // console.log('Inserted File', fileName);

                return { fileName, status: 'success' };
            } catch (error) {
                console.error('Error fetching or saving file:', fileName, error);
                return { fileName, status: 'error', error: error.message || 'Unknown error' };
            }
        }

        const results = [];

        for (const file of data) {
            const result = await processFile(file, ACCESS_TOKEN);
            results.push(result);
            console.log('results', results.length)
            // return new Response(`Syncronizing files`);
        }

        console.log('All files processed:', results);

        // for (const file of data) {
        //     console.log('file of data', file)
        //     const fileId = file.id;
        //     const fileName = file.name;

        //     try {
        //         // const response = await axios({
        //         //     method: 'get',
        //         //     url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        //         //     responseType: 'stream',
        //         //     headers: {
        //         //         Authorization: `Bearer ${ACCESS_TOKEN}`,
        //         //     },
        //         // });

        //         const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        //         const headers = {
        //             Authorization: `Bearer ${ACCESS_TOKEN}`,
        //         };

        //         const response = await fetch(url, {
        //             method: 'GET',
        //             headers: headers,
        //         })

        //         if (!response.ok) {
        //             throw new Error(`Failed to fetch file ${fileName}. Status: ${response.status}`);
        //         }

        //         const chunks = [];
        //         let totalSize = 0;

        //         // Read data in chunks and accumulate in the buffer array
        //         for await (const chunk of response.body) {
        //             chunks.push(chunk);
        //             totalSize += chunk.length;
        //         }

        //         // Combine chunks into a single buffer
        //         const buffer = Buffer.concat(chunks, totalSize);

        //         const content = buffer.toString()
        //         console.log('content', content)

        //         var userQuery = drizzleSql`INSERT INTO `;
        //         let tableColumns = `${tableToDelete} (filename , content) values ('${fileName}' , '${content}')`

        //         userQuery.queryChunks[0].value[0] += tableColumns

        //         var dataInsertion = await db.execute(drizzleSql`${userQuery}`);
        //         // console.log('Downloaded File', fileName);

        //     } catch (error) {
        //         console.error('Error fetching file:', error);
        //     }
        // }

        return results;

    }

    async function createNewVault(files, request) {
        const db = drizzle(sql)
        console.log('now in create new vault')

        var userQuery = drizzleSql`INSERT INTO `;
        const tableNameInsertion = `vaults (vault_name , price) values ('${files.name}' , ${0.00}) `
        userQuery.queryChunks[0].value[0] += tableNameInsertion
        var vaultNameInsertion = await db.execute(drizzleSql`${userQuery}`);

        const getNewVaultIdQuery = drizzleSql`SELECT id from `
        const getNewVaultId = `vaults where vault_name = '${files.name}'`
        getNewVaultIdQuery.queryChunks[0].value[0] += getNewVaultId
        var newVaultIdGet = await db.execute(drizzleSql`${getNewVaultIdQuery}`);

        var tableReferenceInsertionInVaults = drizzleSql`UPDATE vaults `;
        const tableReferenceInsertion = `set reference_table = 'table${newVaultIdGet.rows[0].id}' where id = ${newVaultIdGet.rows[0].id} `
        tableReferenceInsertionInVaults.queryChunks[0].value[0] += tableReferenceInsertion
        var referenceTableInserted = await db.execute(drizzleSql`${tableReferenceInsertionInVaults}`);

        var createNewVaultQuery = drizzleSql`CREATE TABLE `
        const createNewVault = `table${newVaultIdGet.rows[0].id} (id serial PRIMARY KEY , filename VARCHAR(255) UNIQUE , content TEXT)`
        createNewVaultQuery.queryChunks[0].value[0] += createNewVault
        var newVaultCreated = await db.execute(drizzleSql`${createNewVaultQuery}`)

        const data = files.downloadedFiles



        // const newTableId = await db.insert(vaultsTable).values({ vault_name: files.name, price: 0.00 })
        //     .returning({ id: vaultsTable.id });
        // const newTable = await db.update(vaultsTable).set({ reference_table: `table${newTableId[0].id}` })
        //     .where(eq(vaultsTable.id, newTableId[0].id)).returning({ reference_table: vaultsTable.reference_table })
        // // console.log()
        // // console.log('result', result[0].id)

        // const vaultSchema = {
        //     id: 'SERIAL PRIMARY KEY',
        //     filename: 'TEXT',
        //     content: 'TEXT',
        // };

        // const tableName = newTable[0].reference_table;
        // const data = files.downloadedFiles



        // const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
        //         ${Object.entries(vaultSchema)
        //         .map(([column, type]) => `${column} ${type}`)
        //         .join(', ')}
        //         )
        //     `;

        // const insertQuery = `INSERT INTO vaults (vault_name) VALUES ($1)`;
        // const values = [formattedTableName];

        // Execute the insert query with parameterized values
        // await client.query(insertQuery, values);


        // const result = await client.query(createTableQuery);
        // console.log('query ran', result)

        // const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;

        // Execute the create table query


        // const deleteQuery = `DELETE FROM ${tableName}`;


        // const result = await client.query(deleteQuery);



        const downloadedFilesFromDrive = [];

        for (const file of data) {
            const fileId = file.id;
            const fileName = file.name;
            // console.log('fileid', fileId, 'filename', fileName)

            const accessToken = request.headers.get('authorization')
            const ACCESS_TOKEN = accessToken.substring('Bearer '.length);

            try {
                // const response = await axios({
                //     method: 'get',
                //     url: `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
                //     responseType: 'stream',
                //     headers: {
                //         Authorization: `Bearer ${ACCESS_TOKEN}`,
                //     },
                // });

                // let content = '';

                // response.data.on('data', (chunk) => {
                //     content += chunk.toString();
                // });

                // await new Promise((resolve) => {
                //     response.data.on('end', async () => {
                //         console.log(`Downloaded file ${fileName}`);

                //         const insertQuery = `INSERT INTO ${tableName} (filename, content) VALUES ($1, $2)`;
                //         const values = [fileName, content];

                //         await client.query(insertQuery, values);

                //         downloadedFilesFromDrive.push({
                //             filename: fileName,
                //             content: content,
                //         });
                //         resolve();
                //     });
                // });


                const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
                const headers = {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                };

                fetch(url, {
                    method: 'GET',
                    headers: headers,
                }).then(async (response) => {

                    const reader = response.body.getReader();

                    let content = '';

                    async function readStream() {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                // All data has been read
                                return content; // Resolve the promise with the content
                            }
                            // Accumulate the chunk
                            content += new TextDecoder().decode(value);
                        }
                    }

                    readStream().then(async (fileContent) => {
                        // console.log('fileName', fileName, 'content', fileContent)

                        let tableColumns = `table${newVaultIdGet.rows[0].id} (filename , content) values ('${fileName}' , '${fileContent}')`

                        var insertDataInNewVault = drizzleSql`INSERT INTO `;
                        insertDataInNewVault.queryChunks[0].value[0] += tableColumns
                        // console.log('insertDataInNewVault:', insertDataInNewVault);

                        var dataInsertion = await db.execute(drizzleSql`${insertDataInNewVault}`);
                        // console.log('Downloaded File', fileName);

                    }).catch((error) => {
                        console.error('Error reading the stream:', error);
                    });

                }).catch((error) => {
                    console.log('error', error)
                })




            } catch (error) {
                console.error('Error fetching file:', error);
            }
        }

        console.log('vault created and data uploaded')
        // console.log('downloadedFilesFromDrive', downloadedFilesFromDrive)

        return downloadedFilesFromDrive
    }

    try {
        let downloadedFiles = []
        // console.log('results', results)

        for (const folder of results) {
            // console.log('folder option', folder)
            if (folder.option === 'Create new vault') {

                downloadedFiles = [...downloadedFiles, ...await createNewVault(folder, req)];

            } else {
                downloadedFiles = [...downloadedFiles, ...await overwriteVault(folder, req)];
            }
        }

        console.log('downloadedFiles = ', downloadedFiles.length)
        // response.status(200).json({
        //     message: `${downloadedFiles.length} files synchronized successfully`,
        //     data: downloadedFiles
        // });
    } catch (error) {
        console.error('Error during file download:', error);
        // response.status(500).json({ message: 'Internal server error' });
    }


    await wait(10000);
    return;
}

export default async function FilesUploadHandler(request, context) {
    if (request.method === "POST") {
        let requestData = '';
        const reader = request.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            requestData += new TextDecoder().decode(value);
        }

        const requestDataObject = JSON.parse(requestData);

        const { message, data } = requestDataObject;

        context.waitUntil(uploadFiles(data, request).then((json) => {
            console.log('checkquery')
            return Response.json({
                name: `Hello, from ${request.url} I'm an Edge Function!`,
            });
        }));

        return new Response(`Syncronizing files`);
        // response.status(200).json({
        //     message: `files synchronized successfully`,
        // });
    } else {
        // return res.status(405).end('Method not allowed'); // Method Not Allowed
    }
}