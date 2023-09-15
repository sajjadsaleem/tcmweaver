import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from "drizzle-orm";

import { usersTable } from '../../../db/schema/users'
// import { pointsTable } from '../../../db/schema/points'
import { rolesTable } from '../../../db/schema/roles'
import { permissionsTable } from '../../../db/schema/permissions'
import { rolePermissionsTable } from '../../../db/schema/rolePermissions'
import * as Helpers from '../../../util/Helpers'
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'
import _ from 'lodash'

export default async function handler(req, res) {

    try {
        const db = drizzle(sql)

        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const { token } = req.body;

        // console.log('token: ', req.body, token)


        var tokenResult = jwt.verify(token)
        var message = "Token has been verified successfully"
        console.log('tokenResult=', tokenResult)

        var user = []
        if (tokenResult) {

            const userId = tokenResult.id

            user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
            message = "Token has been expired, please login again"

            console.log('user=', user)

        }

        var getPermissions = [];
        var getRole = '';
        var totalPoints = 0;

        // console.log('user', user)

        if (user.length > 0) {
            const roleResult = await db.select().from(rolesTable).where(eq(rolesTable.id, user[0]['role_id']));
            if (roleResult.length > 0) {
                getRole = roleResult[0]['name']
                const getRolePermissions = await db.select().from(rolePermissionsTable).where(eq(rolePermissionsTable.role_id, user[0]['role_id']));
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

        // var pointsQuery = await db.select().from(pointsTable).where(eq(pointsTable.user_id, tokenResult.id));
        // // console.log('pointsQuery--------------------------------',pointsQuery,pointsQuery.length)
        // if (pointsQuery.length > 0) {
        //     totalPoints = _.sumBy(pointsQuery, 'points');
        // }

        if (!user.length > 0) {
            tokenResult = null
        }

        return res.status(200).send({
            success: true,
            status: "success",
            errors: [],
            message: message,
            tokenResult: tokenResult,
            token: token,
            user: user && user.length > 0 ? user[0] : user,
            user_permissions: getPermissions,
            user_role: getRole,
            user_points: totalPoints,
        });

    } catch (error) {

        console.error('Error verify token:', error);

        return res.status(500).send({
            success: false,
            status: "error",
            errors: [{ error: error }],
            message: 'Internal Server Error'
        });

    }
}
