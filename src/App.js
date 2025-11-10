import Navbar from './Components/Navbar';
import UserNavBar from './Components/UserNavBar';
import SideBar from './Components/sidebar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Users/Home';
import Registration from './Pages/Users/Registration';
import Login from './Pages/Users/Login';
import Booking from './Pages/Booking';
import Contactus from './Pages/Users/Contactus';
import { ToastContainer } from 'react-toastify';
import Dashboard from './Pages/Users/Dashboard';
import { useEffect, useState } from 'react';
import Profile from './Pages/Users/Profile';
import Tracking from './Pages/Users/Tracking';
import UserTable from './Pages/Users/UserTable';
import BookingTable from './Pages/admin/BookingsTable';
import Aboutus from './Pages/Users/Aboutus';
import ContactDetails from './Pages/admin/contactdetails';
import AdminDashboard from './Pages/admin/adminDashboard';
import History from './Pages/Users/History';
import api from './Api/axios';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null); // clear user state
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Router>
      {/* ✅ Show correct navbar */}
      {!user && <Navbar />}
      {user?.userType === "user" && <UserNavBar user={user} handleLogout={handleLogout} />}
      {user?.userType === "admin" && <SideBar setUser={setUser} />}

      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/signin" element={<Login setUser={setUser} />} />
        <Route path="/service" element={<Booking />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/userDashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/userData" element={<UserTable />} />
        <Route path="/bookingstable" element={<BookingTable />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/contactdetails" element={<ContactDetails />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
