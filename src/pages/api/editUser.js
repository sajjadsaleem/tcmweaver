import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import { roles } from '../../db/schema/roles'
import { permissions } from '../../db/schema/permissions'
import { rolePermission } from '../../db/schema/rolePermissions'
import { userPackagesTable } from '../../db/schema/userPackages';
import { userVaultsTable } from '../../db/schema/userVaults';
import { packagesTable } from '../../db/schema/packages';
import { vaultPackagesTable } from '../../db/schema/vaultPackages';
import { vaultsTable } from '../../db/schema/vaults';
import _ from 'lodash'

export default async function updateUser(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, currentUser, data } = req.body;
            console.log('Email:', email);
            console.log('Data:', data);

            // Find the user in the database based on their email and update the fields
            // const updatedUser = await prisma.users.update({
            //     where: {
            //         email: email,
            //     },
            //     data: {
            //         role_id: data.role === 'admin' ? 1 : 2,
            //         email: data.email,
            //         username: data.email,
            //         full_name: data.fullName,
            //         status: data.status
            //     },
            // });

            const db = drizzle(sql)
            const updatedUser = await db.update(users)
                .set({
                    role_id: data.role === 'Admin' ? 1 : 2,
                    email: data.email,
                    username: data.email,
                    full_name: data.fullName,
                    status: data.status,
                    image: data.image
                }).where(eq(users.email, email))
                .returning();

            console.log('updateduser', updatedUser)




            var getPermissions = [];
            var getRole = '';
            var flatVaultsData = []
            var formattedVaultsData = []
            var flatPackageData = []

            if (updatedUser.length > 0) {
                const roleResult = await db.select().from(roles).where(eq(roles.id, updatedUser[0]['role_id']));
                if (roleResult.length > 0) {
                    getRole = roleResult[0]['name']
                    const getRolePermissions = await db.select().from(rolePermission).where(eq(rolePermission.role_id, updatedUser[0]['role_id']));
                    if (getRolePermissions.length > 0) {
                        const permissionIds = _.map(getRolePermissions, 'permission_id');
                        // console.log('getRolePermissions=',getRolePermissions)
                        const permissionResult = await sql`SELECT * FROM permissions WHERE id = ANY(${permissionIds}::int[])`;
                        if (permissionResult['rowCount'] > 0) {
                            getPermissions = _.map(permissionResult['rows'], 'name');
                        }
                        // console.log('permissionResult=',getPermissions,permissionResult['rows'])
                    }
                }

                const packageIds = await db.select({ packageIds: userPackagesTable.package_id })
                    .from(userPackagesTable)
                    .where(eq(userPackagesTable.user_id, updatedUser[0].id))

                const userVaultsIds = await db.select({ vltId: userVaultsTable.vault_id }).from(userVaultsTable)
                    .where(eq(userVaultsTable.user_id, updatedUser[0].id))
                const vaultIdsFlat = userVaultsIds.map((item) => item.vltId);

                // console.log('packageids', packageIds)

                const ids = packageIds.map(row => row.packageIds);


                let packageData = []
                let vaultsData = []

                for (const id of ids) {
                    const packageNames = await db.select({ packageName: packagesTable.name })
                        .from(packagesTable)
                        .where(eq(packagesTable.id, id));

                    packageData.push({ id, packages: packageNames });
                }



                // console.log('ids', ids)

                for (const vaults of ids) {
                    const vaultsNames = await db.select({ vaultId: vaultPackagesTable.vault_id })
                        .from(vaultPackagesTable)
                        .where(eq(vaultPackagesTable.package_id, vaults));

                    // console.log('vaultsNames', vaultsNames)

                    vaultsData.push({ id: vaultsNames });

                }

                // console.log('vaultsdata', vaultsData)

                const flattenedVaultsArray = vaultsData.flatMap(item => item.id.map(obj => obj.vaultId));
                // console.log('flatenedvaultsarray', flattenedVaultsArray)

                let flatVaultsIds = [...new Set(flattenedVaultsArray)];

                flatVaultsIds = [...flatVaultsIds, ...vaultIdsFlat.filter((id) => !flatVaultsIds.includes(id))];

                // console.log('flatvaultsids', flatVaultsIds)

                for (const vaultId of flatVaultsIds) {
                    flatVaultsData.push(await db.select({
                        vaultId: vaultsTable.id, vaultName: vaultsTable.vault_name,
                        referenceTable: vaultsTable.reference_table
                    }).from(vaultsTable).where(eq(vaultsTable.id, vaultId)))
                }

                // console.log('flatVaultsData', flatVaultsData)

                formattedVaultsData = flatVaultsData.map(item => ({
                    vaultId: item[0].vaultId,
                    vaultName: item[0].vaultName,
                    tableName: item[0].referenceTable
                }));

                // console.log(formattedVaultsData);

                // console.log('flatvaultsdata', flatVaultsData)


                flatPackageData = packageData.map(item => ({
                    id: item.id,
                    packageName: item.packages.map(name => name.packageName)[0]
                })).flat();
            }


            if (currentUser === 1) {
                const allUsers = await db.select().from(users);
                res.status(200).json({ message: 'User updated successfully', allUsers, getPermissions, getRole });
            } else {
                const allUsers = await db.select().from(users).where(eq(users.email, data.email));
                res.status(200).json({ message: 'User updated successfully', allUsers, getPermissions, getRole, vaultsAccess: formattedVaultsData });
            }


        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user' });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}
