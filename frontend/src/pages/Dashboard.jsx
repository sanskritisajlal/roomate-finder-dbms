import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  // Filters
  const [block, setBlock] = useState("");
  const [roomType, setRoomType] = useState("");
  const [bedCount, setBedCount] = useState("");

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      let query = [];

      if (block) query.push(`block=${block}`);
      if (roomType) query.push(`room_type=${roomType}`);
      if (bedCount) query.push(`bed_count=${bedCount}`);

      const queryString = query.length ? `?${query.join("&")}` : "";

      const res = await axios.get(`http://localhost:5000/api/listings${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings");
    }
  };

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-blue-700">
        All Listings
      </h1>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-end">
        {/* Block Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Block</label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">All Blocks</option>
            {Array.from({ length: 26 }, (_, i) => (
              <option key={i} value={String.fromCharCode(65 + i)}>
                Block {String.fromCharCode(65 + i)}
              </option>
            ))}
          </select>
        </div>

        {/* Room Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">All</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </div>

        {/* Bed Count Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Beds</label>
          <select
            value={bedCount}
            onChange={(e) => setBedCount(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">All</option>
            {[2, 3, 4, 6, 8].map((num) => (
              <option key={num} value={num}>
                {num} Beds
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={fetchListings}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>

        {/* Reset Button */}
        <button
          onClick={() => {
            setBlock("");
            setRoomType("");
            setBedCount("");
            fetchListings();
          }}
          className="bg-gray-300 text-black px-5 py-2 rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      {/* Listings Section */}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div
              key={listing.listing_id}
              className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl text-blue-700 mb-1">
                Block {listing.block}
              </h3>
              <p className="text-gray-700">Room Type: {listing.room_type}</p>
              <p className="text-gray-700">Total Beds: {listing.bed_count}</p>
              <p className="text-gray-700">Remaining: {listing.roommates_remaining}</p>
              <p className="text-gray-700">Status: {listing.status}</p>
              <p className="text-gray-600 italic mt-1">
                Keywords: {listing.keywords || "None"}
              </p>

              <button
                onClick={() => handleRequest(listing.listing_id)}
                disabled={listing.requestSent}
                className={`mt-4 w-full py-2 rounded text-white transition ${
                  listing.requestSent
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {listing.requestSent ? "Sent!" : "Give Request"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No listings found.
          </p>
        )}
      </div>
    </div>
  );
}
