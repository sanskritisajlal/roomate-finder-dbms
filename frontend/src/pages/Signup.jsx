import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", reg_no: "", phone: "", gender: "male", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="First Name" onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="border p-2 rounded" required />
          <input placeholder="Last Name" onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="border p-2 rounded" required />
        </div>
        <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded w-full mt-2" required />
        <input placeholder="Reg No" onChange={(e) => setForm({ ...form, reg_no: e.target.value })} className="border p-2 rounded w-full mt-2" required />
        <input placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border p-2 rounded w-full mt-2" required />
        <select onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border p-2 rounded w-full mt-2">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input type="password" placeholder="Password (min 8 chars)" onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 rounded w-full mt-2" required />
        <button type="submit" className="bg-primary text-white w-full py-2 rounded mt-3">Sign Up</button>
        <p className="text-sm mt-2 text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
