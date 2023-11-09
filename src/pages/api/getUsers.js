import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { userPackagesTable } from '../../db/schema/userPackages'
import { packagesTable } from '../../db/schema/packages';

export default async function getUsers(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)

            const allPackages = await db.select().from(packagesTable)

            const allUserPackages = await db.select().from(userPackagesTable)
            for (let userPackage of allUserPackages) {
                // Find the corresponding package in allPackages
                let matchingPackage = allPackages.find(userCheckPackage => userCheckPackage.id === userPackage.package_id);

                // If a matching package is found, replace the package_id with the package name
                if (matchingPackage) {
                    userPackage.package_id = matchingPackage.name;
                }
            }

            const allUsers = await db.select().from(users);

            allUsers.forEach(user => {
                const userPackages = allUserPackages.filter(pkg => pkg.user_id === user.id);

                const subscriptionArray = userPackages.map(pkg => pkg.package_id);

                user.subscriptions = subscriptionArray;
            });




            res.status(200).json({ allUsers });
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }
}