import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '../../Components/sidebar';
import AdminDashboard from './adminDashboard';
import UserTable from './UserTable';
import BookingsTable from './BookingsTable';
import BookingHistory from './BookingHistory';
import OrdersTable from './OrdersTable';
import OrderHistory from './OrderHistory';
import AddProduct from './AddProduct';
import AddMechanic from './AddMechanic';
import ContactDetails from './contactdetails';

const AdminLayout = ({ user, setUser }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <Router>
            <Sidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                setUser={setUser}
            />

            <Routes>
                <Route
                    path="/adminDashboard"
                    element={<AdminDashboard isCollapsed={isCollapsed} />}
                />
                <Route path="/userData" element={<UserTable isCollapsed={isCollapsed} />} />
                <Route path="/bookingstable" element={<BookingsTable isCollapsed={isCollapsed} />} />
                <Route path="/admin/booking-history" element={<BookingHistory isCollapsed={isCollapsed} />} />
                <Route path="/admin/orders" element={<OrdersTable isCollapsed={isCollapsed} />} />
                <Route path="/admin/order-history" element={<OrderHistory isCollapsed={isCollapsed} />} />
                <Route path="/admin/add-product" element={<AddProduct isCollapsed={isCollapsed} />} />
                <Route path="/admin/add-mechanic" element={<AddMechanic isCollapsed={isCollapsed} />} />
                <Route path="/contactdetails" element={<ContactDetails isCollapsed={isCollapsed} />} />

                {/* Redirect root for admin */}
                <Route
                    path="/"
                    element={<AdminDashboard isCollapsed={isCollapsed} />}
                />
            </Routes>
        </Router>
    );
};

export default AdminLayout;
