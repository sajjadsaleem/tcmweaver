import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import { roles } from '../../db/schema/roles'
import { permissions } from '../../db/schema/permissions'
import { rolePermission } from '../../db/schema/rolePermissions'
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
                    status: data.status
                }).where(eq(users.email, email))
                .returning();

            console.log('updateduser', updatedUser)




            var getPermissions = [];
            var getRole = '';

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
            }

            if (currentUser === 1) {
                const allUsers = await db.select().from(users);
                res.status(200).json({ message: 'User updated successfully', allUsers, getPermissions, getRole });
            } else {
                const allUsers = await db.select().from(users).where(eq(users.email, data.email));
                res.status(200).json({ message: 'User updated successfully', allUsers, getPermissions, getRole });
            }


        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user' });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}
