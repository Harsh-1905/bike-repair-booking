import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import "./booking-history.css";

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

    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "badge bg-success";
            case "Cancelled":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        return booking.status.toLowerCase() === filter;
    });

    if (loading) {
        return (
            <div
                style={{
                    marginLeft: isCollapsed ? "80px" : "250px",
                    padding: "20px",
                    transition: "margin-left 0.3s ease",
                }}
            >
                <div className="text-center p-5">Loading...</div>
            </div>
        );
    }

    return (
        <div
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                padding: "20px",
                transition: "margin-left 0.3s ease",
            }}
        >
            <div className="booking-history-header">
                <h2 className="mb-3">Booking History</h2>
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
                        Completed ({bookings.filter((b) => b.status === "Completed").length})
                    </button>
                    <button
                        className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
                        onClick={() => setFilter("cancelled")}
                    >
                        Cancelled ({bookings.filter((b) => b.status === "Cancelled").length})
                    </button>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center p-5">
                        <p className="text-muted mb-0">No booking history found</p>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Owner</th>
                                    <th>Bike</th>
                                    <th>Number</th>
                                    <th>Service</th>
                                    <th>Mechanic</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td style={{ width: "12%" }}>
                                            {booking.user_id
                                                ? booking.user_id.fullName
                                                : "N/A"}
                                        </td>

                                        <td style={{ width: "12%" }}>
                                            {booking.bikeCompany} {booking.bikeModel}
                                        </td>

                                        <td style={{ width: "10%" }}>{booking.bikeNumPlate}</td>

                                        <td style={{ width: "15%" }}>{booking.bikeService}</td>

                                        <td style={{ width: "15%" }}>
                                            {booking.mechanic_id ? (
                                                <div>
                                                    <div style={{ fontWeight: "600" }}>
                                                        {booking.mechanic_id.fullName}
                                                    </div>
                                                    <small className="text-muted">
                                                        {booking.mechanic_id.phone}
                                                    </small>
                                                </div>
                                            ) : (
                                                <span className="text-muted">Not assigned</span>
                                            )}
                                        </td>

                                        <td style={{ width: "12%" }}>
                                            {new Date(booking.date).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            <strong>₹{booking.price}</strong>
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            <span className={getStatusClass(booking.status)}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
