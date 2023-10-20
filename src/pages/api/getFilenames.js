import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults';
import pg from 'pg';
// import { dataset } from '../../db/schema/dataset'

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


export default async function getFilenames(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)

            const allVaults = await db.select({
                vault_name: vaultsTable.vault_name,
                reference_table: vaultsTable.reference_table,
                vault_price: vaultsTable.price
            }).from(vaultsTable);
            // console.log('allVaults', allVaults)

            const allData = {};

            (async () => {
                const promises = allVaults.map(async (vault) => {
                    // console.log('vault', vault)
                    const { vault_name, reference_table, vault_price } = vault;
                    const client = await pool.connect();
                    try {
                        const query = `SELECT filename FROM ${reference_table}`;
                        const result = await client.query(query);
                        // allData[vault_name] = result.rows;
                        allData[vault_name] = {
                            filenames: result.rows,
                            vault_price: vault_price,
                        };


                    } finally {
                        client.release();
                    }
                });

                // Wait for all the queries to complete
                await Promise.all(promises);

                // console.log('allData', allData)

                // Remove ".md" extension
                for (const vaultName in allData) {
                    if (allData.hasOwnProperty(vaultName)) {
                        const vaultData = allData[vaultName];
                        // console.log('vaultdata', vaultData)
                        // console.log('filename', vaultData.filename)

                        // Modify filenames in the vaultData
                        const modifiedVaultData = vaultData.filenames.map((item) => {
                            const { filename, ...rest } = item;
                            const filenameWithoutExtension = filename.replace(/\.[^.]+$/, ''); // Removes the file extension
                            return {
                                filename: filenameWithoutExtension,
                                ...rest,
                            };
                        });

                        // console.log('modifieddata', modifiedVaultData)

                        // Update allData with the modified data
                        // console.log('alldatavaultname', allData[vaultName])
                        allData[vaultName].filenames = modifiedVaultData;
                    }
                }

                // Now, allData contains filenames without extensions
                // console.log('allData', allData);

                res.status(200).json(allData);





                // const extensionRemovedData = datasets.map(item => {
                //     return {
                //         ...item,
                //         fileName: item.filename.replace(/\.md$/, '')
                //     };
                // });
            })();






        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}

