// frontend/src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "/logo.png";

export default function Navbar({ setToken }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 shadow-lg sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 text-white">
        {/* Logo + Name */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 drop-shadow-md hover:scale-105 transition"
          />
          <h1 className="text-2xl font-semibold tracking-tight drop-shadow-sm">
            RentMate
          </h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-6 font-medium relative">
          {user && (
            <span className="text-sm italic hidden sm:inline text-blue-50">
              Hi, {user.name} ({user.reg_number})
            </span>
          )}

          <button
            onClick={() => navigate("/create")}
            className="hover:text-yellow-200 transition"
          >
            Create
          </button>

          <button
            onClick={() => navigate("/mylistings")}
            className="hover:text-yellow-200 transition"
          >
            My Listings
          </button>

          {/* 📨 Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-yellow-200 transition flex items-center gap-1"
            >
              Requests ▾
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn text-gray-800">
                <button
                  onClick={() => {
                    navigate("/sentrequests");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-t-lg"
                >
                  📤 Sent Requests
                </button>
                <button
                  onClick={() => {
                    navigate("/receivedrequests");
                    setDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg"
                >
                  📥 Received Requests
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 font-medium px-4 py-1.5 rounded-lg hover:bg-blue-50 transition shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
