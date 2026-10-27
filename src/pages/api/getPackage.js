import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { vaultsTable } from '../../db/schema/vaults'
import { vaultPackagesTable } from '../../db/schema/vaultPackages';
import { packagesTable } from '../../db/schema/packages';
import { eq, lt, gte, ne } from "drizzle-orm";


export default async function getPackage(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)

            // console.log('req', req.query.q)
            const selectedVault = await db.select({ vaultId: vaultsTable.id }).from(vaultsTable)
                .where(eq(vaultsTable.vault_name, req.query.q));

            // console.log('selectedVault', selectedVault[0].vaultId)

            const packageIds = await db.select({ packagesId: vaultPackagesTable.package_id })
                .from(vaultPackagesTable).where(eq(vaultPackagesTable.vault_id, selectedVault[0].vaultId))

            // console.log('packageIds', packageIds)

            const allPackages = await db.select({ packageApiId: packagesTable.api_id, packageName: packagesTable.package_name })
                .from(packagesTable)
                .where((eq(packagesTable.id, packageIds[0].packagesId)))

            console.log('allpackages', allPackages)


            res.status(200).json(allPackages);
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}