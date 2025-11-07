import { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "../components/ListingCard.jsx";
import FilterBar from "../components/FilterBar.jsx";

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ block: "", room_type: "", bed_count: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/listings", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setListings(res.data);
    };
    fetchData();
  }, [filters]);

  const handleRequest = async (listing_id) => {
    await axios.post(`http://localhost:5000/api/requests/${listing_id}/request`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Request sent!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Good to see you 👋</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((l) => (
          <ListingCard key={l.listing_id} data={l} onRequest={handleRequest} />
        ))}
      </div>
    </div>
  );
}
