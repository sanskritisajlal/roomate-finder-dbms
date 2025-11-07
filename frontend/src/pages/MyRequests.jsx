import { useEffect, useState } from "react";
import axios from "axios";

export default function MyRequests() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/requests/received", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Received Requests</h2>
      {data.map((r) => (
        <div key={r.request_id} className="bg-white p-3 mb-2 rounded shadow">
          <p>{r.first_name} ({r.email}) - {r.status}</p>
        </div>
      ))}
    </div>
  );
}
