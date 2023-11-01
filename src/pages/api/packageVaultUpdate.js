import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultPackagesTable } from '../../db/schema/vaultPackages';
import { eq, lt, gte, ne } from "drizzle-orm";
import { packagesTable } from '../../db/schema/packages';
import { vaultsTable } from '../../db/schema/vaults';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function packageVaultUpdate(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method not allowed'); // Method Not Allowed
    }

    try {
        const db = drizzle(sql)

        const newArray = req.body.selectedVaults.map(item => ({ name: item.value }));

        const updateProductFeatures = await stripe.products.update(
            req.body.packageId, { features: newArray, }
        );

        if (updateProductFeatures) {
            const allVaultsData = await db.select().from(vaultsTable)

            const matchingIds = allVaultsData
                .filter(vault => newArray.some(item => item.name === vault.vault_name))
                .map(vault => vault.id);

            const packageIdToUpdate = await db.select({ packageId: packagesTable.id })
                .from(packagesTable).where(eq(packagesTable.stripe_prod_id, req.body.packageId))

            // console.log('packageidtoudpate', packageIdToUpdate[0].packageId, 'matchingIds', matchingIds)

            const deleteDataBeforeUpdate = await db.delete(vaultPackagesTable)
                .where(eq(vaultPackagesTable.package_id, packageIdToUpdate[0].packageId));

            for (const currId of matchingIds) {
                const udpatedPackage = await db.insert(vaultPackagesTable)
                    .values({ package_id: packageIdToUpdate[0].packageId, vault_id: currId })
            }
        }



        res.status(200).json({ message: 'package Vault Api ' });

    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
}