import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults'
import { eq, lt, gte, ne } from "drizzle-orm";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


export default async function deleteVault(req, res) {
    if (req.method === 'DELETE') {
        const { vaultName } = req.query;

        try {
            const db = drizzle(sql)

            // const referenceTableToDelete = await db.select({ referenceTable: vaultsTable.reference_table }).from(vaultsTable).where(eq(vaultsTable.vault_name, vaultName))
            // console.log('referencetabletodelete', referenceTableToDelete)

            const deletedVault = await db.delete(vaultsTable).where(eq(vaultsTable.vault_name, vaultName))
                .returning({ deletedId: vaultsTable.reference_table });

            console.log('deletedVault', deletedVault)

            const dropTableQuery = `DROP TABLE ${deletedVault[0].deletedId}`;

            (async () => {
                const client = await pool.connect();

                try {
                    await client.query(dropTableQuery);
                    console.log(`Table "${vaultName}" has been dropped.`);
                } catch (error) {
                    console.error(`Error dropping table "${vaultName}":`, error);
                } finally {
                    client.release();
                    await pool.end();
                }
            })();



            const allVaults = await db.select().from(vaultsTable);

            res.status(200).json({ message: 'Vault deleted successfully', allVaults });
        } catch (error) {
            console.log('Error deleting vault:', error);
            res.status(500).json({ message: 'Failed to delete vault', error: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}
