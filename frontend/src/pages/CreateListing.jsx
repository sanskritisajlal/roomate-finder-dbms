import { useState } from "react";
import axios from "axios";

export default function CreateListing() {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ block: "", room_type: "AC", bed_count: 2, roommates_remaining: 1, cgpa_preference: "", keywords: "", origin: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/listings", form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Listing created!");
  };

  return (
    <div className="flex justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded w-96">
        <h2 className="text-xl font-semibold mb-3">Create Listing</h2>
        {Object.keys(form).map((k) => (
          <input key={k} placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="border p-2 w-full mb-2 rounded" required />
        ))}
        <button className="bg-primary text-white w-full py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
