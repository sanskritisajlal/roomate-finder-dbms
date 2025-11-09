import { pool } from "../config/db.js";

// ✅ Get all listings except current user's own listings
export const getAllListings = async (req, res) => {
  const { gender, user_id } = req.user;
  const { block, keywords } = req.query;

  try {
    let query = `SELECT * FROM listings 
                 WHERE status='Pending' 
                 AND gender=$1 
                 AND owner_id <> $2`;
    const params = [gender, user_id];

    if (block) {
      params.push(block);
      query += ` AND block=$${params.length}`;
    }
    if (keywords) {
      params.push(`%${keywords}%`);
      query += ` AND keywords ILIKE $${params.length}`;
    }

    if (req.query.room_type) {
  params.push(req.query.room_type);
  query += ` AND room_type=$${params.length}`;
}
if (req.query.bed_count) {
  params.push(req.query.bed_count);
  query += ` AND bed_count=$${params.length}`;
}


    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    res.status(500).json({ message: "Failed to load listings" });
  }
};

// ✅ Create listing
export const createListing = async (req, res) => {
  const owner_id = req.user.user_id;
  const gender = req.user.gender;
  const {
    block,
    room_type,
    bed_count,
    roommates_remaining,
    cgpa_preference,
    keywords,
    origin,
  } = req.body;

  try {
    const exists = await pool.query(
      "SELECT * FROM listings WHERE owner_id=$1 AND block=$2",
      [owner_id, block]
    );
    if (exists.rows.length > 0)
      return res
        .status(400)
        .json({ message: "Listing already exists for this block" });

    await pool.query(
      `INSERT INTO listings 
       (owner_id, gender, block, room_type, bed_count, roommates_remaining, cgpa_preference, keywords, origin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        owner_id,
        gender,
        block,
        room_type,
        bed_count,
        roommates_remaining,
        cgpa_preference,
        keywords,
        origin,
      ]
    );

    res.status(201).json({ message: "Listing created successfully" });
  } catch (err) {
    console.error("Error creating listing:", err.message);
    res.status(500).json({ message: "Error creating listing" });
  }
};

// ✅ Get my listings
export const getMyListings = async (req, res) => {
  try {
    console.log("Fetching listings for owner:", req.user.user_id); // 👈 add this line
    const result = await pool.query(
      "SELECT * FROM listings WHERE owner_id=$1 ORDER BY created_at DESC",
      [req.user.user_id]
    );
    
    console.log("Found listings:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading my listings:", err.message);
    res.status(500).json({ message: "Error loading listings" });
  }
};

// ✅ Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.user.user_id;
    const result = await pool.query(
      "DELETE FROM listings WHERE listing_id=$1 AND owner_id=$2 RETURNING *",
      [id, owner_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Listing not found or not authorized" });
    }

    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Failed to delete listing" });
  }
};

export const updateListing = async (req, res) => {
  const { listingId } = req.params;
  const owner_id = req.user.user_id; // from JWT user info
  const fields = req.body;

  try {
    // 1️⃣ Ensure that the listing belongs to the logged-in user
    const result = await pool.query(
      "SELECT * FROM listings WHERE listing_id=$1 AND owner_id=$2",
      [listingId, owner_id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "You are not authorized to edit this listing." });
    }

    // 2️⃣ Dynamically build the update query
    const updates = [];
    const values = [];

    // Prevent changing the block, but allow other fields
    Object.entries(fields).forEach(([key, value], i) => {
      if (key !== "block") {
        updates.push(`${key}=$${i + 1}`);
        values.push(value);
      }
    });

    // Add the listing ID for the update
    values.push(listingId);

    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // 3️⃣ Update the listing (excludes "block")
    const query = `UPDATE listings SET ${updates.join(", ")} WHERE listing_id=$${values.length}`;
    await pool.query(query, values);

    res.status(200).json({ message: "Listing updated successfully" });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ message: "Failed to update listing." });
  }
};
