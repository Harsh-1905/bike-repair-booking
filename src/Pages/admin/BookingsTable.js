import React, { useEffect, useState } from "react";
import api from "../../Api/axios";

const BookingTable = ({ isCollapsed }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const serviceMap = {
        1: "General Service",
        2: "On Road Service",
        3: "All-Over Service"
    };

    useEffect(() => {
        api.get("/bookings")
            .then((res) => {
                if (res.data.success) {
                    setBookings(res.data.data);
                }
            })
            .catch((err) => console.error("Error fetching bookings:", err));
    }, []);

    return (
        <div
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                padding: "20px",
                transition: "margin-left 0.3s ease"
            }}
        >
            <h2 className="text-center mb-4">Bookings</h2>

            {/* ===== TABLE ===== */}
            <table className="table table-hover text-center">
                <thead className="table-dark">
                    <tr>
                        <th>S.no</th>
                        <th>User Name</th>
                        <th>Bike Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <tr key={booking._id}>
                                <td>{index + 1}</td>
                                <td>
                                    {booking.user_id
                                        ? `${booking.user_id.firstName} ${booking.user_id.lastName}`
                                        : "N/A"}
                                </td>
                                <td>{booking.bike_name}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        View More
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No bookings found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ===== BLUR MODAL ===== */}
            {selectedBooking && (
                <div
                    className="booking-modal-overlay"
                    onClick={() => setSelectedBooking(null)}
                >
                    <div
                        className="booking-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="booking-modal-header">
                            <h5>Booking Details</h5>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => setSelectedBooking(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="booking-modal-body">
                            <p>
                                <strong>User Name:</strong>{" "}
                                {selectedBooking.user_id
                                    ? `${selectedBooking.user_id.firstName} ${selectedBooking.user_id.lastName}`
                                    : "N/A"}
                            </p>
                            <p>
                                <strong>Bike Name:</strong>{" "}
                                {selectedBooking.bike_name}
                            </p>
                            <p>
                                <strong>Number Plate:</strong>{" "}
                                {selectedBooking.bike_numplate}
                            </p>
                            <p>
                                <strong>Date & Time:</strong>{" "}
                                {new Date(
                                    selectedBooking.date_time
                                ).toLocaleString()}
                            </p>
                            <p>
                                <strong>Service:</strong>{" "}
                                {serviceMap[selectedBooking.bike_services]}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                {selectedBooking.status}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== CSS ===== */}
            <style>
                {`
                .booking-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .booking-modal {
                    background: #fff;
                    width: 420px;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: popup 0.3s ease;
                }

                .booking-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                }

                .booking-modal-body p {
                    margin: 8px 0;
                }

                @keyframes popup {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default BookingTable;
