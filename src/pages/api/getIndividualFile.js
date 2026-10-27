import { sql } from '@vercel/postgres';
import { sql as drizzleSql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { vaultsTable } from '../../db/schema/vaults'
import { eq, lt, gte, ne } from "drizzle-orm";


export default async function getTags(req, res) {
    try {
        const inputValue = `${req.query.q}.md`
        const vaultToFind = req.query.vn

        const db = drizzle(sql)

        const vaultReference = await db.select({ referenceTable: vaultsTable.reference_table })
            .from(vaultsTable).where(eq(vaultToFind, vaultsTable.vault_name));

        const tableName = vaultReference[0].referenceTable

        const selectQuery = drizzleSql`SELECT * FROM `;
        const selectQueryJoint = `${tableName} where filename = '${inputValue}'`
        selectQuery.queryChunks[0].value[0] += selectQueryJoint
        var dataFromVaultAccess = await db.execute(drizzleSql`${selectQuery}`);

        res.status(200).json(dataFromVaultAccess.rows[0]);
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }
}