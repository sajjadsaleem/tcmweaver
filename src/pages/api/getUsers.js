import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { userPackagesTable } from '../../db/schema/userPackages'
import { packagesTable } from '../../db/schema/packages';
import { userVaultsTable } from '../../db/schema/userVaults'
import { vaultsTable } from '../../db/schema/vaults';

export default async function getUsers(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)

            const allPackages = await db.select().from(packagesTable)
            const allVaults = await db.select().from(vaultsTable)

            const allUserPackages = await db.select().from(userPackagesTable)
            const allUserVaults = await db.select().from(userVaultsTable)


            for (let userPackage of allUserPackages) {
                // Find the corresponding package in allPackages
                let matchingPackage = allPackages.find(userCheckPackage => userCheckPackage.id === userPackage.package_id);

                // If a matching package is found, replace the package_id with the package name
                if (matchingPackage) {
                    userPackage.package_id = matchingPackage.name;
                }
            }

            for (let userVault of allUserVaults) {
                let matchingVault = allVaults.find(userCheckVault => userCheckVault.id === userVault.vault_id);

                if (matchingVault) {
                    userVault.vault_id = matchingVault.vault_name;
                }
            }

            const allUsers = await db.select({
                id: users.id,
                email: users.email,
                username: users.username,
                full_name: users.full_name,
                status: users.status,
                image: users.image,
                role_id: users.role_id
            }).from(users);

            allUsers.forEach(user => {
                const userPackages = allUserPackages.filter(pkg => pkg.user_id === user.id);
                const userVaults = allUserVaults.filter(vlt => vlt.user_id === user.id)

                const subscriptionArray = userPackages.map(pkg => pkg.package_id);
                const vaultsArray = userVaults.map(vlt => vlt.vault_id)

                user.subscriptions = subscriptionArray;
                user.vaults = vaultsArray
            });




            res.status(200).json({ allUsers });
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }
}