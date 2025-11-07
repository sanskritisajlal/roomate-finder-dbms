import { pool } from "../config/db.js";

export const createRequest = async (req, res) => {
  const requester_id = req.user.user_id; // From JWT token
  const { listingId } = req.params; // Listing ID from URL params

  try {
    // Check if listing exists
    const listing = await pool.query("SELECT * FROM listings WHERE listing_id=$1", [listingId]);
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user has already sent a request for the same listing
    const existingRequest = await pool.query(
      "SELECT * FROM requests WHERE listing_id=$1 AND requester_id=$2",
      [listingId, requester_id]
    );
    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ message: "You have already requested this listing" });
    }

    // Insert a new request for the listing
    await pool.query(
      "INSERT INTO requests (listing_id, requester_id, status) VALUES ($1, $2, 'Pending')",
      [listingId, requester_id]
    );

    res.status(201).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Failed to send request" });
  }
};

// ✅ Fetch all requests received by the current user (as listing owner)
export const getReceivedRequests = async (req, res) => {
  const owner_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT r.request_id, r.status, 
              u.first_name, u.last_name, u.email, u.phone,
              l.block, l.room_type
       FROM requests r
       JOIN listings l ON r.listing_id = l.listing_id
       JOIN users u ON r.requester_id = u.user_id
       WHERE l.owner_id = $1
       ORDER BY r.created_at DESC`,
      [owner_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching received requests:", err.message);
    res.status(500).json({ message: "Failed to load received requests" });
  }
};

export const acceptRequest = async (req, res) => {
  const { requestId } = req.params;
  const user_id = req.user.user_id;
  const r = await pool.query(`
    SELECT r.*, l.user_id AS owner_id, l.roommates_remaining
    FROM requests r JOIN listings l ON r.listing_id=l.listing_id
    WHERE r.request_id=$1
  `, [requestId]);
  if (!r.rows.length) return res.status(404).json({ message: "Not found" });
  const data = r.rows[0];
  if (data.owner_id !== user_id) return res.status(403).json({ message: "Unauthorized" });

  await pool.query("UPDATE requests SET status='Accepted' WHERE request_id=$1", [requestId]);
  await pool.query("UPDATE listings SET roommates_remaining=roommates_remaining-1 WHERE listing_id=$1", [data.listing_id]);

  const updated = await pool.query("SELECT roommates_remaining FROM listings WHERE listing_id=$1", [data.listing_id]);
  if (updated.rows[0].roommates_remaining <= 0)
    await pool.query("UPDATE listings SET status='Completed' WHERE listing_id=$1", [data.listing_id]);

  res.json({ message: "Accepted" });
};

export const rejectRequest = async (req, res) => {
  await pool.query("UPDATE requests SET status='Rejected' WHERE request_id=$1", [req.params.requestId]);
  res.json({ message: "Rejected" });
};

export const cancelRequest = async (req, res) => {
  const requester_id = req.user.user_id;
  const request_id = req.params.requestId;
  const reqCheck = await pool.query("SELECT * FROM requests WHERE request_id=$1 AND requester_id=$2", [request_id, requester_id]);
  if (!reqCheck.rows.length)
    return res.status(403).json({ message: "Invalid request" });

  await pool.query("DELETE FROM requests WHERE request_id=$1", [request_id]);
  await pool.query("UPDATE listings SET roommates_remaining=roommates_remaining+1, status='Pending' WHERE listing_id=$1",
    [reqCheck.rows[0].listing_id]);
  res.json({ message: "Cancelled" });
};

export const getMyRequests = async (req, res) => {
  const requester_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT r.request_id, r.status, 
              l.block, l.room_type, l.owner_id, 
              u.first_name AS owner_name, u.phone AS owner_phone
       FROM requests r
       JOIN listings l ON r.listing_id = l.listing_id
       JOIN users u ON l.owner_id = u.user_id
       WHERE r.requester_id = $1
       ORDER BY r.created_at DESC`,
      [requester_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching my requests:", err.message);
    res.status(500).json({ message: "Failed to load your requests" });
  }
};