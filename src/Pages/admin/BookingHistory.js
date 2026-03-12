import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHistory, 
    faMotorcycle, 
    faUser, 
    faCalendarAlt, 
    faCheckCircle,
    faTimesCircle,
    faWrench,
    faRupeeSign
} from "@fortawesome/free-solid-svg-icons";
import "./admin-tables.css";

const BookingHistory = ({ isCollapsed }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, completed, cancelled

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        api.get("/bookings")
            .then((res) => {
                if (res.data.success) {
                    // Filter only completed and cancelled bookings
                    const pastBookings = res.data.data.filter(
                        (booking) => booking.status === "Completed" || booking.status === "Cancelled"
                    );
                    setBookings(pastBookings);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed": return faCheckCircle;
            case "Cancelled": return faTimesCircle;
            default: return faHistory;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed": return "#28a745";
            case "Cancelled": return "#dc3545";
            default: return "#6c757d";
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        return booking.status.toLowerCase() === filter;
    });

    if (loading) {
        return (
            <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
                <div className="admin-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p>Loading booking history...</p>
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
                            <FontAwesomeIcon icon={faHistory} />
                        </div>
                        <div className="header-text">
                            <h1>Booking History</h1>
                            <p>View completed and cancelled bookings</p>
                        </div>
                    </div>
                    <div className="stats-badge">
                        <span className="stats-number">{bookings.length}</span>
                        <span className="stats-label">Total History</span>
                    </div>
                </div>

                <div className="simple-table-card">
                    <div className="table-header">
                        <h3>
                            <FontAwesomeIcon icon={faMotorcycle} className="me-2" />
                            Service History
                        </h3>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                All ({bookings.length})
                            </button>
                            <button
                                className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                                onClick={() => setFilter("completed")}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Completed ({bookings.filter((b) => b.status === "Completed").length})
                            </button>
                            <button
                                className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
                                onClick={() => setFilter("cancelled")}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} />
                                Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})
                            </button>
                        </div>
                    </div>
                    
                    <div className="simple-table-container">
                        <table className="simple-table history-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Service</th>
                                    <th>Booked On</th>
                                    <th>Service Date</th>
                                    <th>Mechanic</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="name-cell">
                                            {booking.user_id ? booking.user_id.fullName : "N/A"}
                                        </td>
                                        <td>
                                            <div className="vehicle-info">
                                                <div className="vehicle-name">
                                                    {booking.bikeCompany} {booking.bikeModel}
                                                </div>
                                                <div className="vehicle-number">
                                                    {booking.bikeNumPlate}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="subject-cell">
                                            {booking.bikeService}
                                        </td>
                                        <td className="date-cell">
                                            <div className="date-value">
                                                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                            <div className="time-value">
                                                {new Date(booking.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true
                                                })}
                                            </div>
                                        </td>
                                        <td className="date-cell">
                                            <div className="date-value">
                                                {new Date(booking.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            {booking.mechanic_id ? (
                                                <div>
                                                    <div className="name-cell">
                                                        {booking.mechanic_id.fullName}
                                                    </div>
                                                    <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                        {booking.mechanic_id.phone}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999', fontStyle: 'italic' }}>Not assigned</span>
                                            )}
                                        </td>
                                        <td className="subject-cell">₹{booking.price}</td>
                                        <td>
                                            <span 
                                                className="status-badge" 
                                                style={{ 
                                                    backgroundColor: getStatusColor(booking.status),
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="empty-row">
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faHistory} className="empty-icon" />
                                                <span>No history found for the selected filter</span>
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

export default BookingHistory;
