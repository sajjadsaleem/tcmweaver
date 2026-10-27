import type { Config } from "drizzle-kit";

if (!process.env.DB_CONNECTION_STRING) {
    throw new Error("DB_CONNECTION_STRING environment variable is not defined.");
}

export default {
    schema: "./src/db/schema/*",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DB_CONNECTION_STRING,
    }
} satisfies Config;




