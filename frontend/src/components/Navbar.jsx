import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null; // Decode token safely

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      {/* 🔹 App Title */}
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Roommate Finder
      </h1>

      {/* 🔹 Right Section */}
      <div className="flex items-center space-x-5">
        {/* 👤 User Info */}
        {user && (
          <span className="text-sm font-medium">
            Welcome, {user.name} ({user.reg_number})
          </span>
        )}

        {/* 🔹 Navigation Buttons */}
        <button
          onClick={() => navigate("/create")}
          className="hover:underline"
        >
          Create Listing
        </button>

        <button
          onClick={() => navigate("/mylistings")}
          className="hover:underline"
        >
          My Listings
        </button>

        {/* 🔽 Requests Dropdown */}
        <div className="relative group">
          <button className="hover:underline">Requests ▾</button>
          <div className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg right-0 mt-1 w-44 z-50">
            <button
              onClick={() => navigate("/myrequests")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              My Sent Requests
            </button>
            <button
              onClick={() => navigate("/receivedrequests")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Received Requests
            </button>
          </div>
        </div>

        {/* 🔴 Logout Button */}
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
