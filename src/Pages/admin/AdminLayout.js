import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AdminDashboard from './adminDashboard';
import UserTable from './UserTable';
import BookingTable from './BookingTable';
import ContactUsAdmin from './ContactUsAdmin';
import Profile from './Profile';

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
                <Route path="/bookingstable" element={<BookingTable isCollapsed={isCollapsed} />} />
                <Route path="/contactdetails" element={<ContactUsAdmin isCollapsed={isCollapsed} />} />
                <Route path="/profile" element={<Profile isCollapsed={isCollapsed} />} />

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
