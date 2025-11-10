// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import MyListings from "./pages/MyListings.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import ReceivedRequests from "./pages/ReceivedRequests.jsx"; // ✅ add this
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      {token && <Navbar setToken={setToken} />}
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={(t) => setToken(t)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={token ? <CreateListing /> : <Navigate to="/login" />} />
        <Route path="/mylistings" element={token ? <MyListings /> : <Navigate to="/login" />} />
        <Route path="/sentrequests" element={token ? <MyRequests /> : <Navigate to="/login" />} />
        <Route path="/receivedrequests" element={token ? <ReceivedRequests /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
