import { sql } from '@vercel/postgres';
import { sql as drizzleSql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultsTable } from '../../db/schema/vaults'
import { eq, lt, gte, ne, or } from "drizzle-orm";


export default async function getWelcomePage(req, res) {

    if (req.method == 'POST') {
        return res.status(405).end('Method not allowed');
    } else {
        try {


            const db = drizzle(sql)

            const configVault = await db.select({ reference_table: vaultsTable.reference_table })
                .from(vaultsTable).where(eq(vaultsTable.vault_name, 'CONFIG'))


            const selectQuery = drizzleSql`SELECT * FROM `;
            const selectQueryJoint = `${configVault[0].reference_table} WHERE filename = 'welcome.md'`
            selectQuery.queryChunks[0].value[0] += selectQueryJoint
            var welcomePageFound = await db.execute(drizzleSql`${selectQuery}`);

            // console.log('welcomePageFound', welcomePageFound)
            let welcomePageData = welcomePageFound.rows



            // remove .md extension from Filenames
            welcomePageData = welcomePageFound.rows.map(obj => ({
                ...obj,
                filename: obj.filename.replace(/\.md$/i, '')
            }));

            // const nodeColors = nodeColorsData.filter(obj => obj.filename.toLowerCase().includes('color'));
            // console.log(nodeColors)






            res.status(200).json({ welcomePageData });
        } catch (error) {
            console.log('getWelcomePage api error ---', error)
        }

    }




}