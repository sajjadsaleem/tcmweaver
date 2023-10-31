import fs from 'fs/promises';
import path from 'path';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { filtersTable } from '../../db/schema/filters'
import { packagesTable } from '../../db/schema/packages';
import { vaultsTable } from '../..//db/schema/vaults'
import { eq, lt, gte, ne, or } from "drizzle-orm";
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})



export default async function handler(req, res) {
  try {

    // Drizzle Command
    const db = drizzle(sql)
    const client = await pool.connect();

    const basicTable = await db.select({ reference_table: vaultsTable.reference_table }).from(vaultsTable)
      .where(eq(vaultsTable.vault_name, 'Basic Vault'))

    // console.log('basictable', basicTable)
    const filenameToSearch = 'Home.md';
    const query = `SELECT filename, content FROM ${basicTable[0].reference_table} WHERE filename = $1`;
    const values = [filenameToSearch];

    const homeMd = await client.query(query, values);

    const homeFile = homeMd.rows[0]
    // console.log('result', homeFile)


    let datasetArray = await db.select({
      filename: filtersTable.filename, content: filtersTable.content,
    }).from(filtersTable).where(
      or(
        eq(filtersTable.filename, 'SAMPLE FILTERS.md'),
        eq(filtersTable.filename, 'Home.md')
      )
    );

    const allVaults = await db.select().from(vaultsTable)
    // console.log('allVaults', allVaults)

    const updatedDatasetArray = datasetArray.map(obj => {
      return {
        fileName: obj.filename,
        content: obj.content

      };
    });

    const updatedArrayWithPackages = [
      ...updatedDatasetArray,
      { allVaults }, { fileName: homeFile.filename, content: homeFile.content }
    ];


    res.status(200).json(updatedArrayWithPackages);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files.' });
  }
}