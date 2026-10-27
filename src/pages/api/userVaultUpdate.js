import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { vaultPackagesTable } from '../../db/schema/vaultPackages';
import { eq, lt, gte, ne } from "drizzle-orm";
import { packagesTable } from '../../db/schema/packages';
import { vaultsTable } from '../../db/schema/vaults';
import { userVaultsTable } from '../../db/schema/userVaults';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function packageVaultUpdate(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method not allowed')
    }

    try {
        const db = drizzle(sql)

        const newArray = req.body.selectedVaults.map(item => ({ name: item.value }));

        const allVaults = await db.select({ vaultId: vaultsTable.id, vaultName: vaultsTable.vault_name }).from(vaultsTable)


        const vaultIdsArray = newArray.map((newObj) => {
            const foundVault = allVaults.find((vault) => vault.vaultName === newObj.name);
            return foundVault ? foundVault.vaultId : null;
        });

        const deleteUserVault = await db.delete(userVaultsTable).where(eq(userVaultsTable.user_id, req.body.userId));

        const vaultsInsertion = vaultIdsArray.map(async (vlt) => {
            const userVaultInsertion = await db.insert(userVaultsTable).values({ user_id: req.body.userId, vault_id: vlt });
        })

        res.status(200).json({ message: 'user Vault Api ' });

    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
}