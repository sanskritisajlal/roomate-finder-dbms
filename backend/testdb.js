import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "room",
  password: "chris",
  port: 5432,
});

pool.query("SELECT NOW()")
  .then(r => {
    console.log("✅ Connected! Time:", r.rows[0]);
    process.exit(0);
  })
  .catch(e => {
    console.error("❌ Connection failed:", e);
    process.exit(1);
  });