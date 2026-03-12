import Navbar from './Components/Navbar';
import UserNavBar from './Components/UserNavBar';
import Sidebar from './Components/sidebar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Users/Home';
import Registration from './Pages/Users/Registration';
import Login from './Pages/Users/Login';
import Contactus from './Pages/Users/Contactus';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import Profile from './Pages/Users/Profile';
import UserTable from './Pages/admin/UserTable';
import BookingTable from './Pages/admin/BookingsTable';
import Aboutus from './Pages/Users/Aboutus';
import ContactDetails from './Pages/admin/contactdetails';
import AdminDashboard from './Pages/admin/adminDashboard';
import api from './Api/axios';
import ForgotPassword from './Pages/Users/forgot_password';
import ResetPassword from './Pages/Users/Reset_Password';
import UserHome from './Pages/Users/UserHomepage';
import Services from './Pages/Users/OurServices';
import { CartProvider } from "./Pages/Users/Store/Cartcontext";
import OrdersTable from './Pages/admin/OrdersTable';
import OrderHistory from './Pages/admin/OrderHistory';
import AddProduct from './Pages/admin/AddProduct';
import AddMechanic from './Pages/admin/AddMechanic';
import BookingHistory from './Pages/admin/BookingHistory';

// Store related imports
import Store from './Pages/Users/Store/Store';
import Cart from './Pages/Users/Store/Cart';
import Checkout from './Pages/Users/Store/Checkout';
import OrderSuccess from './Pages/Users/Store/OrderSuccess';
import MyOrders from './Pages/Users/Store/MyOrders';
import NotificationsPage from './Pages/Users/Notifications';

// Booking related imports
import Booking from './Pages/Users/Booking/Booking';
import ServiceSelection from './Pages/Users/Booking/Service_selection';
import CustomizeSelection from './Pages/Users/Booking/CustomizeSelection';
import ServiceBill from './Pages/Users/Booking/ServiceBill';
import ServiceBilling from './Pages/Users/Booking/ServiceBilling';
import History from './Pages/Users/Booking/History';
import Tracking from './Pages/Users/Booking/Tracking';
function App() {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <CartProvider>
      <Router>
        {/* ✅ Show correct navbar */}
        {!user && <Navbar />}
        {user?.userType === "user" && <UserNavBar user={user} handleLogout={handleLogout} />}
        {user?.userType === "admin" && <Sidebar setUser={setUser} isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />}

        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/signin" element={<Login setUser={setUser} />} />
          <Route path="/service" element={<Booking />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/profile" element={<Profile isCollapsed={user?.userType === "admin" ? isCollapsed : undefined} />} />
          <Route path="/userData" element={<UserTable />} />
          <Route path="/bookingstable" element={<BookingTable isCollapsed={isCollapsed} />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactdetails" element={<ContactDetails isCollapsed={isCollapsed} />} />
          <Route path="/adminDashboard" element={<AdminDashboard isCollapsed={isCollapsed} />} />
          <Route path="/history" element={<History />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/store" element={<Store />} />
          <Route path="/serviceselection" element={<ServiceSelection />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/service-billing" element={<ServiceBilling />} />
          <Route path="/customselection" element={<CustomizeSelection />} />
          <Route path="/userhomepage" element={<UserHome />} />
          <Route path="/ourservices" element={<Services />} />
          <Route path="/servicebill" element={<ServiceBill />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/admin/orders" element={<OrdersTable isCollapsed={isCollapsed} />} />
          <Route path="/admin/order-history" element={<OrderHistory isCollapsed={isCollapsed} />} />
          <Route path="/admin/add-product" element={<AddProduct isCollapsed={isCollapsed} />} />
          <Route path="/admin/add-mechanic" element={<AddMechanic isCollapsed={isCollapsed} />} />
          <Route path="/admin/booking-history" element={<BookingHistory isCollapsed={isCollapsed} />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
