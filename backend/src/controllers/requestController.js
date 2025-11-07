import { pool } from "../config/db.js";

export const createRequest = async (req, res) => {
  const requester_id = req.user.user_id;
  const { listingId } = req.params;
  const listing = await pool.query("SELECT * FROM listings WHERE listing_id=$1", [listingId]);
  if (!listing.rows.length)
    return res.status(404).json({ message: "Listing not found" });

  const exists = await pool.query("SELECT * FROM requests WHERE listing_id=$1 AND requester_id=$2", [listingId, requester_id]);
  if (exists.rows.length)
    return res.status(400).json({ message: "Already requested" });

  await pool.query("INSERT INTO requests (listing_id, requester_id) VALUES ($1,$2)", [listingId, requester_id]);
  res.status(201).json({ message: "Request sent" });
};

export const getReceivedRequests = async (req, res) => {
  const owner_id = req.user.user_id;
  const result = await pool.query(`
    SELECT r.request_id, r.status, u.first_name, u.email, u.phone, l.block
    FROM requests r
    JOIN listings l ON r.listing_id = l.listing_id
    JOIN users u ON r.requester_id = u.user_id
    WHERE l.user_id = $1
  `, [owner_id]);
  res.json(result.rows);
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
