import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ Load listings when page loads
  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/listings/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(res.data);
      console.log("Loaded listings:", res.data);
    } catch (err) {
      console.error("Error loading listings:", err);
      setError("Failed to load listings");
    }
  };

  const handleEdit = (listing) => {
    setIsEditing(true);
    setEditListing(listing);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { listing_id } = editListing;
      const { room_type, bed_count, roommates_remaining, cgpa_preference, keywords } = editListing;

      await axios.put(
        `http://localhost:5000/api/listings/${listing_id}`,
        { room_type, bed_count, roommates_remaining, cgpa_preference, keywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMyListings();
      setIsEditing(false);
      setEditListing(null);
    } catch (err) {
      console.error("Error updating listing:", err);
      setError("Failed to update listing.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditListing(null);
  };

  const deleteListing = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyListings();
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError("Could not delete listing");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Listings</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isEditing ? (
        <div className="bg-white p-6 shadow-md rounded">
          <h2 className="text-xl mb-4">Edit Listing</h2>
          <form onSubmit={handleSubmitEdit}>
            <label className="block mb-4">
              Room Type:
              <select
                value={editListing.room_type}
                onChange={(e) => setEditListing({ ...editListing, room_type: e.target.value })}
                required
                className="border p-2 w-full rounded"
              >
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </label>

            <label className="block mb-4">
              Total Beds:
              <select
                value={editListing.bed_count}
                onChange={(e) => setEditListing({ ...editListing, bed_count: e.target.value })}
                required
                className="border p-2 w-full rounded"
              >
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="6">6 Beds</option>
                <option value="8">8 Beds</option>
              </select>
            </label>

            <label className="block mb-4">
              Roommates Remaining:
              <input
                type="number"
                value={editListing.roommates_remaining}
                onChange={(e) =>
                  setEditListing({ ...editListing, roommates_remaining: e.target.value })
                }
                required
                className="border p-2 w-full rounded"
              />
            </label>

            <label className="block mb-4">
              CGPA Preference:
              <input
                type="text"
                value={editListing.cgpa_preference || ""}
                onChange={(e) =>
                  setEditListing({ ...editListing, cgpa_preference: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
            </label>

            <label className="block mb-4">
              Keywords:
              <input
                type="text"
                value={editListing.keywords || ""}
                onChange={(e) => setEditListing({ ...editListing, keywords: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </label>

            <div className="flex space-x-3">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.length > 0 ? (
            listings.map((l) => (
              <div key={l.listing_id} className="bg-white border p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-1">Block {l.block}</h3>
                <p>Room Type: {l.room_type}</p>
                <p>Beds: {l.bed_count}</p>
                <p>Remaining: {l.roommates_remaining}</p>
                <p>Status: {l.status}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(l)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteListing(l.listing_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No listings found. Try creating one!</p>
          )}
        </div>
      )}
    </div>
  );
}
