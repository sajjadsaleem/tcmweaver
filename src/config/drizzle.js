// import { createClient } from '@vercel/postgres';
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import dotenv from 'dotenv';

// // Load environment variables from .env file
// dotenv.config();

// // const db = drizzle(sql({
// //     url: process.env.POSTGRES_URL,
// //     host: process.env.POSTGRES_HOST,
// //     port: process.env.POSTGRES_PORT,
// //     database: process.env.POSTGRES_DATABASE,
// //     user: process.env.POSTGRES_USER,
// //     password: process.env.POSTGRES_PASSWORD,
// // }));

// const db = drizzle(createClient({
//     // connectionString: "postgres://postgres:admin@0.0.0.0:5432/postgres",
// }));

// console.log('db=', db)

// export default db;