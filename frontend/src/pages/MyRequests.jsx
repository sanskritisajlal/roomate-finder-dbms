// frontend/src/pages/MyRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests/mine");
      setRequests(res.data);
    } catch {
      setError("Failed to load your requests");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`/requests/${id}/cancel`);
      fetchRequests();
    } catch {
      alert("Failed to cancel request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Sent Requests</h1>
      {error && <p className="text-red-500">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">No requests sent yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((r) => (
            <div key={r.request_id} className="border p-4 rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-1">Block {r.block} - {r.room_type}</h3>
              <p>Status: <b>{r.status}</b></p>
              <p>Owner: {r.owner_first_name} {r.owner_last_name}</p>
              <p>Email: {r.owner_email}</p>
              <p>Phone: {r.owner_phone}</p>
              <p className="text-sm mt-2 text-gray-500">
                Sent on {new Date(r.created_at).toLocaleString()}
              </p>

              {r.status === "Pending" && (
                <button
                  onClick={() => handleCancel(r.request_id)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
