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
import { userPackagesTable } from '../../../db/schema/userPackages';
import { vaultPackagesTable } from '../../../db/schema/vaultPackages'
import { packagesTable } from '../../../db/schema/packages';
import * as jwt from '../../../util/jwt'
import _ from 'lodash'
import { vaultsTable } from '../../../db/schema/vaults';
import { userVaultsTable } from '../../../db/schema/userVaults'

export default async function handler(req, res) {

    try {
        const db = drizzle(sql)
        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const { token } = req.body;
        // console.log('token : ', token)
        var tokenResult = jwt.verify(token)
        // console.log('tokenResult:', tokenResult)
        var message = "Token has been verified successfully"
        // console.log('tokenResult=', token, tokenResult)

        var user = []
        if (tokenResult) {
            const userId = tokenResult.id
            user = await db.select().from(users).where(eq(users.id, userId));
            message = "Token has been expired, please login again"

            // console.log('user: ', user)

        }

        var getPermissions = [];
        var getRole = '';
        var flatPackageData = []
        var flatVaultsData = []
        var formattedVaultsData = []

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

            const packageIds = await db.select({ packageIds: userPackagesTable.package_id })
                .from(userPackagesTable)
                .where(eq(userPackagesTable.user_id, user[0].id))

            const userVaultsIds = await db.select({ vltId: userVaultsTable.vault_id }).from(userVaultsTable)
                .where(eq(userVaultsTable.user_id, user[0].id))
            const vaultIdsFlat = userVaultsIds.map((item) => item.vltId);

            const ids = packageIds.map(row => row.packageIds);

            let packageData = []
            let vaultsData = []

            for (const id of ids) {
                const packageNames = await db.select({ packageName: packagesTable.name })
                    .from(packagesTable)
                    .where(eq(packagesTable.id, id));

                packageData.push({ id, packages: packageNames });
            }

            for (const vaults of ids) {
                const vaultsNames = await db.select({ vaultId: vaultPackagesTable.vault_id })
                    .from(vaultPackagesTable)
                    .where(eq(vaultPackagesTable.package_id, vaults));

                // console.log('vaultsNames', vaultsNames)

                vaultsData.push({ id: vaultsNames });

            }


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

            // console.log('flatpackagedata', flatPackageData)

        }

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
            package: flatPackageData,
            vaultsAccess: formattedVaultsData
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