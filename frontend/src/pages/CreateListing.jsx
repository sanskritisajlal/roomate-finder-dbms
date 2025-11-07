import { useState } from "react";

export default function CreateListing() {
  const [block, setBlock] = useState("");
  const [roomType, setRoomType] = useState("");
  const [bedCount, setBedCount] = useState("");
  const [roommatesRemaining, setRoommatesRemaining] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [keywords, setKeywords] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form submit logic here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Listing</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Block Dropdown (A-Z) */}
        <label className="block mb-4">
          Block:
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select Block</option>
            {Array.from({ length: 26 }, (_, i) => (
              <option key={i} value={String.fromCharCode(65 + i)}>
                {String.fromCharCode(65 + i)}
              </option>
            ))}
          </select>
        </label>

        {/* Room Type */}
        <label className="block mb-4">
          Room Type:
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select Room Type</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>
        </label>

        {/* Total Beds */}
        <label className="block mb-4">
          Total Beds:
          <select
            value={bedCount}
            onChange={(e) => setBedCount(e.target.value)}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select Bed Count</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
            <option value="6">6 Beds</option>
            <option value="8">8 Beds</option>
          </select>
        </label>

        {/* Roommates Remaining */}
        <label className="block mb-4">
          Roommates Remaining:
          <input
            type="number"
            value={roommatesRemaining}
            onChange={(e) => setRoommatesRemaining(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
        </label>

        {/* Optional Fields (cgpa, keywords, city) */}
        <label className="block mb-4">
          CGPA:
          <input
            type="text"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </label>

        <label className="block mb-4">
          Keywords:
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </label>

        <label className="block mb-4">
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit Listing
        </button>
      </form>
    </div>
  );
}
