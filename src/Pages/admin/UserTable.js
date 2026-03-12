import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUser, faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./admin-tables.css";

const UserTable = ({ isCollapsed }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        api.get("/users")
            .then((res) => {
                if (res.data.success) {
                    setUsers(res.data.users);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => { fetchUsers(); }, []);

    if (loading) {
        return (
            <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
                <div className="admin-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p>Loading user details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
            <div className="admin-container">
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div className="header-text">
                            <h1>User Management</h1>
                            <p>Manage and view all registered users</p>
                        </div>
                    </div>
                    <div className="stats-badge">
                        <span className="stats-number">{users.length}</span>
                        <span className="stats-label">Total Users</span>
                    </div>
                </div>

                <div className="simple-table-card">
                    <div className="table-header">
                        <h3>
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            User Details
                        </h3>
                    </div>
                    
                    <div className="simple-table-container">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Full Name</th>
                                    <th>Contact Number</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td className="name-cell">{user.fullName}</td>
                                        <td>{user.contactNumber}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address}</td>
                                        <td className="date-cell">
                                            {user.createdAt ? (
                                                <div>
                                                    <div className="date-value">
                                                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                    <div className="time-value">
                                                        {new Date(user.createdAt).toLocaleTimeString("en-IN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="no-date">No date available</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="empty-row">
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faUsers} className="empty-icon" />
                                                <span>No users found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
