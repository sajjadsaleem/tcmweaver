import { db } from '@vercel/postgres';
const { Client } = require('pg');

export default async function login(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
        const client = new Client({
            connectionString: process.env.POSTGRES_URL,
            ssl: {
              rejectUnauthorized: false,
            },
        });
    
        await client.connect();

      // Query the database to find a user with the provided email
        const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [email]
        );

        if (result.rows.length === 1) {
            const user = result.rows[0];

            // Check if the provided password matches the stored password
            if (user.password === password) {
            // Authentication successful
            // Set a session or JWT token here if needed

            res.status(200).json({ success: true, message: "Authentication successful" });
            } else {
            // Password does not match
            res.status(401).json({ success: false, message: "Authentication failed" });
            }
        } else {
            // User with the provided email not found
            res.status(401).json({ success: false, message: "Authentication failed" });
        }

      // Disconnect from the database
      await client.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
