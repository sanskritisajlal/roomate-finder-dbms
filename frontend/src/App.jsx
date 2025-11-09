import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import MyListings from "./pages/MyListings.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import ReceivedRequests from "./pages/ReceivedRequests.jsx"; // ✅ new import
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔁 Refresh token state when localStorage changes (sync between tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      {/* ✅ Show Navbar only when logged in */}
      {token && <Navbar setToken={setToken} />}

      <Routes>
        {/* 🏠 Main Dashboard */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* 🔐 Auth */}
        <Route
          path="/login"
          element={<Login onLogin={(t) => setToken(t)} />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* 🏡 Listings */}
        <Route
          path="/create"
          element={token ? <CreateListing /> : <Navigate to="/login" />}
        />
        <Route
          path="/mylistings"
          element={token ? <MyListings /> : <Navigate to="/login" />}
        />

        {/* 📩 Requests */}
        <Route
          path="/myrequests"
          element={token ? <MyRequests /> : <Navigate to="/login" />}
        />
        <Route
          path="/receivedrequests"
          element={token ? <ReceivedRequests /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
