import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";
// dotenv.config();

export default {
    // schema: "./src/db/schema.js",
    schema: "./src/db/schema/*",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        connectionString: `postgres://default:***REMOVED***@ep-proud-mud-68868689-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require`,
        // connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`,
    }
} satisfies Config;




