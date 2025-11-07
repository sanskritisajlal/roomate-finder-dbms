import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import MyListings from "./pages/MyListings.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/mylistings" element={<MyListings />} />
        <Route path="/myrequests" element={<MyRequests />} />
      </Routes>
    </BrowserRouter>
  );
}
