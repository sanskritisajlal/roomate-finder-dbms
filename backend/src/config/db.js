import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

// force trim to remove Windows hidden characters
const clean = (v) => (typeof v === "string" ? v.trim() : "");

export const pool = new Pool({
  user: clean(process.env.DB_USER),
  host: "localhost",
  database: clean(process.env.DB_NAME),
  password: clean(process.env.DB_PASSWORD),
  port: Number(clean(process.env.DB_PORT) || 5432),
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL successfully"))
  .catch((err) => console.error("❌ DB connection error:", err));
