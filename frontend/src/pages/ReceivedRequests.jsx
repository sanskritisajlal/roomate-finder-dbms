// frontend/src/pages/ReceivedRequests.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/requests/received");
      setRequests(res.data);
    } catch {
      setError("Failed to load received requests");
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(`/requests/${id}/accept`);
      fetchRequests();
    } catch {
      alert("Failed to accept request");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/requests/${id}/reject`);
      fetchRequests();
    } catch {
      alert("Failed to reject request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Requests Received</h1>
      {error && <p className="text-red-500">{error}</p>}

      {requests.length === 0 ? (
        <p className="text-gray-600">No incoming requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((r) => (
            <div key={r.request_id} className="border p-4 rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-1">Block {r.block} - {r.room_type}</h3>
              <p>Requester: {r.sender_first_name} {r.sender_last_name}</p>
              <p>Email: {r.sender_email}</p>
              <p>Phone: {r.sender_phone}</p>
              <p>Status: <b>{r.status}</b></p>
              <p className="text-sm mt-2 text-gray-500">
                Received on {new Date(r.created_at).toLocaleString()}
              </p>

              {r.status === "Pending" && (
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleAccept(r.request_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r.request_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
