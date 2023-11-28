
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

  const client = await pool.connect();
  try {
    const db = drizzle(sql)

    const configVault = await db.select({ reference_table: vaultsTable.reference_table }).from(vaultsTable)
      .where(eq(vaultsTable.vault_name, 'CONFIG'))
    // console.log('configvault', configVault)

    const query = `SELECT * FROM ${configVault[0].reference_table}`;
    let configData = await client.query(query);
    // console.log('configData', configData.rows)

    // remove .md extension from Filenames
    configData = configData.rows.map(obj => ({
      ...obj,
      filename: obj.filename.replace(/\.md$/i, '')
    }));

    const homeObjects = configData.filter(obj => obj.filename.toLowerCase().includes('home'));
    const filterObjects = configData.filter(obj => obj.filename.toLowerCase().includes('filter'));

    const combinedData = {
      homeObjects,
      filterObjects
    };

    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ error: 'Failed to read files.' });
  } finally {
    client.release();
  }
}