import React from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../Api/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faUsers, faCalendarCheck, faAddressBook, faUserCircle,
    faSignOutAlt, faSignIn, faUserPlus,
    faBars, faTimes
} from "@fortawesome/free-solid-svg-icons";
import '../index.css';

const SidebarItem = ({ icon, text, to, isActive, isCollapsed }) => (
    <li className={`nav-item mb-2 ${isActive ? 'active-sidebar-item' : ''}`}>
        <Link
            className="nav-link text-white d-flex align-items-center py-2"
            to={to}
            style={{
                backgroundColor: isActive ? '#E43636' : 'transparent',
                borderRadius: '8px',
                paddingLeft: '15px',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
        >
            <FontAwesomeIcon
                icon={icon}
                className={isCollapsed ? 'm-0' : 'me-3'}
                style={{ fontSize: '1.2rem', minWidth: '24px' }}
            />
            {!isCollapsed && <span className="navlinktexts">{text}</span>}
        </Link>
    </li>
);

const Sidebar = ({ isCollapsed, toggleSidebar, setUser }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activePath = location.pathname;

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            navigate("/signin");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div
            className="d-flex flex-column p-3 sidebarColor"
            style={{
                width: isCollapsed ? '80px' : '250px',
                height: '100vh',
                backgroundColor: 'black',
                position: 'fixed',
                left: 0,
                top: 0,
                transition: 'width 0.3s ease',
                zIndex: 1030
            }}
        >
            <div className="text-white text-center mb-4 pt-2 d-flex align-items-center justify-content-between">
                {!isCollapsed && (
                    <Link className="text-decoration-none text-white fs-5 fw-bold" to="/">
                        <span style={{ color: '#E43636' }}>Admin</span>Page
                    </Link>
                )}
                <button
                    className="btn btn-sm text-white"
                    onClick={toggleSidebar}
                    style={{ marginLeft: isCollapsed ? 'auto' : '0', marginRight: isCollapsed ? 'auto' : '0' }}
                >
                    <FontAwesomeIcon icon={isCollapsed ? faBars : faTimes} size="lg" />
                </button>
            </div>

            <hr className="text-white-50" />

            <ul className="nav nav-pills flex-column mb-auto">
                <SidebarItem icon={faHome} text="Dashboard" to="/adminDashboard" isActive={activePath === '/adminDashboard'} isCollapsed={isCollapsed} />
                <SidebarItem icon={faUsers} text="User Details" to="/userData" isActive={activePath === '/userData'} isCollapsed={isCollapsed} />
                <SidebarItem icon={faCalendarCheck} text="Bookings Table" to="/bookingstable" isActive={activePath === '/bookingstable'} isCollapsed={isCollapsed} />
                <SidebarItem icon={faAddressBook} text="Contact Details" to="/contactdetails" isActive={activePath === '/contactdetails'} isCollapsed={isCollapsed} />
                <SidebarItem icon={faUserCircle} text="Profile" to="/profile" isActive={activePath === '/profile'} isCollapsed={isCollapsed} />
            </ul>

            <hr className="text-white-50" />

            <ul className="nav nav-pills flex-column mb-auto">
                <SidebarItem icon={faSignIn} text="Sign In" to="/signin" isActive={activePath === '/signin'} isCollapsed={isCollapsed} />
                <SidebarItem icon={faUserPlus} text="Sign Up" to="/signup" isActive={activePath === '/signup'} isCollapsed={isCollapsed} />
                <li className="nav-item mb-2">
                    <button
                        onClick={handleLogout}
                        className="nav-link text-white d-flex align-items-center py-2 w-100"
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            textAlign: "left",
                            justifyContent: isCollapsed ? "center" : "flex-start",
                            borderRadius: "8px",
                            paddingLeft: "15px",
                            cursor: "pointer",
                        }}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className={isCollapsed ? "m-0" : "me-3"} style={{ fontSize: "1.2rem", minWidth: "24px" }} />
                        {!isCollapsed && <span className="navlinktexts">Logout</span>}
                    </button>
                </li>
            </ul>

            <div className="mt-auto py-2 text-center text-white fw-bold" style={{ backgroundColor: '#1c1c3f', textTransform: 'uppercase', letterSpacing: isCollapsed ? '0px' : '2px', transition: 'letter-spacing 0.3s ease' }}>
                {isCollapsed ? 'ADMIN' : 'ADMIN PANEL'}
            </div>
        </div>
    );
};

export default Sidebar;
