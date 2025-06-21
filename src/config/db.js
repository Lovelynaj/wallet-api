import { neon } from "@neondatabase/serverless";
import "dotenv/config";

//Create a SQL Connection using our DATABASE_URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL, 
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL, 
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;

    //Note: amount DECIMAL(10,2) NOT NULL means 10 digit total and 2 digit after decimal point = 99999999.99

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 means success.
  }
}
