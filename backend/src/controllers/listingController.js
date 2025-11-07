import { pool } from "../config/db.js";

export const getAllListings = async (req, res) => {
  const { gender } = req.user;
  const { block, room_type, bed_count } = req.query;

  let query = "SELECT * FROM listings WHERE status='Pending'";
  const params = [];

  if (gender) {
    params.push(gender);
    query += ` AND gender=$${params.length}`;
  }
  if (block) {
    params.push(block);
    query += ` AND block=$${params.length}`;
  }
  if (room_type) {
    params.push(room_type);
    query += ` AND room_type=$${params.length}`;
  }
  if (bed_count) {
    params.push(bed_count);
    query += ` AND bed_count=$${params.length}`;
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
};

export const createListing = async (req, res) => {
  const { user_id, gender } = req.user;
  const { block, room_type, bed_count, roommates_remaining, cgpa_preference, keywords, origin } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM listings WHERE user_id=$1 AND block=$2", [user_id, block]);
    if (existing.rows.length)
      return res.status(400).json({ message: "Listing already exists in this block" });

    await pool.query(
      `INSERT INTO listings (user_id, block, room_type, bed_count, roommates_remaining, cgpa_preference, keywords, origin, gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [user_id, block, room_type, bed_count, roommates_remaining, cgpa_preference, keywords, origin, gender]
    );

    res.status(201).json({ message: "Listing created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyListings = async (req, res) => {
  const result = await pool.query("SELECT * FROM listings WHERE user_id=$1 ORDER BY created_at DESC", [req.user.user_id]);
  res.json(result.rows);
};
