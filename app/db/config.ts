import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
// Load environment variables
config({ path: join(__dirname, "../../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Supabase credentials are not set");
}

// Create a Postgres client with prepared statements
const queryClient = postgres(process.env.DATABASE_URL);

// Create a Drizzle client
export const db = drizzle(queryClient, { schema });

// Create a Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
