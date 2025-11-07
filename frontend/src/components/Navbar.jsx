import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Roommate Finder</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/create" className="hover:underline">Create Request</Link>
        <Link to="/mylistings" className="hover:underline">My Listings</Link>
        <Link to="/myrequests" className="hover:underline">My Requests</Link>
        <button onClick={logout} className="bg-white text-primary px-3 py-1 rounded-md hover:bg-blue-100">Logout</button>
      </div>
    </nav>
  );
}
