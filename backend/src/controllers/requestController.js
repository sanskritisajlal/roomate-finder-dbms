// backend/src/controllers/requestController.js
import { pool } from "../config/db.js";

/**
 * Create a new roommate request
 * POST /api/requests/:listingId/request
 */
export const createRequest = async (req, res) => {
  const sender_id = req.user.user_id;
  const listingId = parseInt(req.params.listingId, 10);

  try {
    // 1️⃣ Check if listing exists
    const listingRes = await pool.query("SELECT * FROM listings WHERE listing_id=$1", [listingId]);
    if (listingRes.rows.length === 0)
      return res.status(404).json({ message: "Listing not found" });

    const listing = listingRes.rows[0];

    // 2️⃣ Prevent self-request
    if (listing.owner_id === sender_id)
      return res.status(400).json({ message: "You cannot request your own listing" });

    // 3️⃣ Check for duplicate request
    const existing = await pool.query(
      "SELECT * FROM requests WHERE listing_id=$1 AND sender_id=$2",
      [listingId, sender_id]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "You already requested this listing" });

    // 4️⃣ Insert new request
    await pool.query(
      `INSERT INTO requests (listing_id, sender_id, receiver_id, status)
       VALUES ($1, $2, $3, 'Pending')`,
      [listingId, sender_id, listing.owner_id]
    );

    res.status(201).json({ message: "Request sent successfully" });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Failed to send request" });
  }
};

/**
 * Get all requests the current user has sent
 * GET /api/requests/mine
 */
export const getMyRequests = async (req, res) => {
  const sender_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT 
        r.request_id, r.status, r.created_at,
        l.listing_id, l.block, l.room_type, l.bed_count, l.roommates_remaining, l.status AS listing_status,
        o.user_id AS owner_id,
        o.first_name AS owner_first_name, o.last_name AS owner_last_name, o.email AS owner_email, o.phone AS owner_phone
       FROM requests r
       JOIN listings l ON r.listing_id = l.listing_id
       JOIN users o ON l.owner_id = o.user_id
       WHERE r.sender_id = $1
       ORDER BY r.created_at DESC`,
      [sender_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching my requests:", err);
    res.status(500).json({ message: "Failed to load your requests" });
  }
};

/**
 * Get all requests received by the current user
 * GET /api/requests/received
 */
export const getReceivedRequests = async (req, res) => {
  const owner_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT 
        r.request_id, r.status, r.created_at,
        s.user_id AS sender_id,
        s.first_name AS sender_first_name, s.last_name AS sender_last_name,
        s.email AS sender_email, s.phone AS sender_phone,
        l.listing_id, l.block, l.room_type, l.bed_count, l.roommates_remaining
       FROM requests r
       JOIN users s ON r.sender_id = s.user_id
       JOIN listings l ON r.listing_id = l.listing_id
       WHERE r.receiver_id = $1
       ORDER BY r.created_at DESC`,
      [owner_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching received requests:", err);
    res.status(500).json({ message: "Failed to load received requests" });
  }
};

/**
 * Accept request
 */
export const acceptRequest = async (req, res) => {
  const requestId = parseInt(req.params.requestId, 10);
  const owner_id = req.user.user_id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const q = await client.query(
      `SELECT r.*, l.owner_id, l.roommates_remaining
       FROM requests r
       JOIN listings l ON r.listing_id = l.listing_id
       WHERE r.request_id=$1 FOR UPDATE`,
      [requestId]
    );

    if (!q.rows.length) throw new Error("Request not found");
    const row = q.rows[0];

    if (row.owner_id !== owner_id) throw new Error("Unauthorized");
    if (row.roommates_remaining <= 0) throw new Error("No beds available");

    await client.query("UPDATE requests SET status='Accepted' WHERE request_id=$1", [requestId]);
    await client.query(
      "UPDATE listings SET roommates_remaining = roommates_remaining - 1 WHERE listing_id = $1",
      [row.listing_id]
    );

    const remaining = (await client.query(
      "SELECT roommates_remaining FROM listings WHERE listing_id=$1",
      [row.listing_id]
    )).rows[0].roommates_remaining;

    if (remaining <= 0) {
      await client.query("UPDATE listings SET status='Completed' WHERE listing_id=$1", [row.listing_id]);
      await client.query(
        "UPDATE requests SET status='Rejected' WHERE listing_id=$1 AND status='Pending'",
        [row.listing_id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Request accepted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error accepting request:", err.message);
    res.status(500).json({ message: err.message || "Failed to accept request" });
  } finally {
    client.release();
  }
};

/**
 * Reject request
 */
export const rejectRequest = async (req, res) => {
  try {
    await pool.query("UPDATE requests SET status='Rejected' WHERE request_id=$1", [req.params.requestId]);
    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

/**
 * Cancel request (by requester)
 */
export const cancelRequest = async (req, res) => {
  const requestId = parseInt(req.params.requestId, 10);
  const sender_id = req.user.user_id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const q = await client.query(
      "SELECT * FROM requests WHERE request_id=$1 FOR UPDATE",
      [requestId]
    );
    if (!q.rows.length) throw new Error("Request not found");
    const row = q.rows[0];
    if (row.sender_id !== sender_id) throw new Error("Unauthorized");

    if (row.status === "Accepted") {
      await client.query(
        `UPDATE listings SET roommates_remaining = roommates_remaining + 1, 
         status = CASE WHEN roommates_remaining + 1 > 0 THEN 'Pending' ELSE status END
         WHERE listing_id=$1`,
        [row.listing_id]
      );
    }

    await client.query("DELETE FROM requests WHERE request_id=$1", [requestId]);
    await client.query("COMMIT");

    res.json({ message: "Request cancelled" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error cancelling request:", err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};
