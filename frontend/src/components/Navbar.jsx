import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null; // Decode token

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // Updates state immediately
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Roommate Finder
      </h1>
      <div className="space-x-4">
        {user && (
          <span>
            Welcome, {user.name} ({user.reg_number})
          </span>
        )}
        <button onClick={() => navigate("/create")}>Create Listing</button>
        <button onClick={() => navigate("/mylistings")}>My Listings</button>
        <button onClick={() => navigate("/myrequests")}>My Requests</button>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
