import { useEffect, useState } from "react";
import axios from "axios";

export default function MyListings() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/listings/mine", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Listings</h2>
      <ul>
        {data.map((d) => (
          <li key={d.listing_id} className="bg-white p-3 mb-2 rounded shadow">
            {d.block} | {d.room_type} | {d.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
