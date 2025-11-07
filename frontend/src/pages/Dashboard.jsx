import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  // Fetch listings when the component mounts
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
    } catch (err) {
      setError("Failed to load listings");
    }
  };

  // Handle "Give Request" action
  const handleRequest = async (listingId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/requests/${listingId}/request`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings((prev) =>
        prev.map((listing) =>
          listing.listing_id === listingId
            ? { ...listing, requestSent: true }
            : listing
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">All Listings</h1>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div
              key={listing.listing_id}
              className="bg-white border rounded-lg shadow p-4"
            >
              <h3 className="font-bold text-lg mb-1">Block {listing.block}</h3>
              <p>Room Type: {listing.room_type}</p>
              <p>Total Beds: {listing.bed_count}</p>
              <p>Remaining: {listing.roommates_remaining}</p>
              <p>Status: {listing.status}</p>
              <p className="text-sm mt-1 italic">
                Keywords: {listing.keywords || "None"}
              </p>

              {/* Add the "Give Request" button */}
              <button
                onClick={() => handleRequest(listing.listing_id)}
                disabled={listing.requestSent}
                className={`mt-3 px-4 py-1 rounded text-white ${
                  listing.requestSent
                    ? "bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {listing.requestSent ? "Sent!" : "Give Request"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No listings found.</p>
        )}
      </div>
    </div>
  );
}
