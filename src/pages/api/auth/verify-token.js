import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import bcrypt from 'bcrypt';
import { eq, and } from "drizzle-orm";

import { users } from '../../../db/schema/users'
import { roles } from '../../../db/schema/roles'
import { permissions } from '../../../db/schema/permissions'
import { rolePermission } from '../../../db/schema/rolePermissions'

import * as jwt from '../../../util/jwt'
import _ from 'lodash'

export default async function handler(req, res) {

    try {
        const db = drizzle(sql)
        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const { token } = req.body;
        console.log('token : ', token)
        var tokenResult = jwt.verify(token)
        console.log('tokenResult:', tokenResult)
        var message = "Token has been verified successfully"
        // console.log('tokenResult=',token,tokenResult)

        var user = []
        if (tokenResult) {
            const userId = tokenResult.id
            user = await db.select().from(users).where(eq(users.id, userId));
            message = "Token has been expired, please login again"

            console.log('user: ', user)

        }

        var getPermissions = [];
        var getRole = '';

        if (user.length > 0) {
            const roleResult = await db.select().from(roles).where(eq(roles.id, user[0]['role_id']));
            if (roleResult.length > 0) {
                getRole = roleResult[0]['name']
                const getRolePermissions = await db.select().from(rolePermission).where(eq(rolePermission.role_id, user[0]['role_id']));
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

        // console.log('pointsQuery--------------------------------',pointsQuery,pointsQuery.length)

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
