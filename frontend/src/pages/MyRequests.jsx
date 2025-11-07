import { useState, useEffect } from "react";
import axios from "axios";

export default function MyRequests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const [sentRes, receivedRes] = await Promise.all([
        axios.get("http://localhost:5000/api/requests/mine", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/requests/received", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSentRequests(sentRes.data);
      setReceivedRequests(receivedRes.data);
    } catch (err) {
      console.error("Error loading requests:", err.response?.data || err.message);
      setError("Failed to load requests");
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadRequests();
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
    }
  };

  const handleAccept = async (id) => {
    await axios.post(
      `http://localhost:5000/api/requests/${id}/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadRequests();
  };

  const handleReject = async (id) => {
    await axios.post(
      `http://localhost:5000/api/requests/${id}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadRequests();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">My Requests</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <h2 className="text-xl font-semibold mb-2">Sent Requests</h2>
      {sentRequests.length === 0 ? (
        <p>No sent requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sentRequests.map((req) => (
            <div key={req.request_id} className="p-4 border rounded shadow bg-white">
              <p><strong>Block:</strong> {req.block}</p>
              <p><strong>Room Type:</strong> {req.room_type}</p>
              <p><strong>Owner:</strong> {req.owner_name}</p>
              <p><strong>Phone:</strong> {req.owner_phone}</p>
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === "Pending" && (
                <button
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleCancel(req.request_id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Received Requests</h2>
      {receivedRequests.length === 0 ? (
        <p>No received requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {receivedRequests.map((req) => (
            <div key={req.request_id} className="p-4 border rounded shadow bg-white">
              <p><strong>Name:</strong> {req.first_name} {req.last_name}</p>
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === "Pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => handleAccept(req.request_id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => handleReject(req.request_id)}
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
