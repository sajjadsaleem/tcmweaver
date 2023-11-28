import { sql } from '@vercel/postgres';
import { sql as drizzleSql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults'
import { eq, lt, gte, ne, or } from "drizzle-orm";

export default async function nodeColors(req, res) {
    try {
        const db = drizzle(sql)

        const configVault = await db.select({ reference_table: vaultsTable.reference_table })
            .from(vaultsTable).where(eq(vaultsTable.vault_name, 'CONFIG'))
        console.log('configvault', configVault[0].reference_table)

        const selectQuery = drizzleSql`SELECT * FROM `;
        const selectQueryJoint = `${configVault[0].reference_table}`
        selectQuery.queryChunks[0].value[0] += selectQueryJoint
        var nodeColorsData = await db.execute(drizzleSql`${selectQuery}`);

        // // console.log('configData', configData.rows)

        // // remove .md extension from Filenames
        nodeColorsData = nodeColorsData.rows.map(obj => ({
            ...obj,
            filename: obj.filename.replace(/\.md$/i, '')
        }));

        const nodeColors = nodeColorsData.filter(obj => obj.filename.toLowerCase().includes('color'));
        // console.log(nodeColors)


        res.status(200).json({ nodeColors });
    } catch (error) {
        console.error('Error reading files:', error);
        res.status(500).json({ error: 'Failed to read files.' });
    }
}