import React, { useEffect, useState } from "react";
import api from "../../Api/axios";

const BookingTable = ({ isCollapsed }) => {
    const [bookings, setBookings] = useState([]);

    const serviceMap = {
        1: "General Service",
        2: "On Road Service",
        3: "All-Over Service"
    };

    useEffect(() => {
        api.get("/bookings")
            .then((res) => {
                if (res.data.success) setBookings(res.data.data);
                else console.error("Failed to fetch bookings");
            })
            .catch((err) => console.error("Error fetching bookings:", err));
    }, []);

    return (
        <div style={{ marginLeft: isCollapsed ? '80px' : '250px', padding: '20px', transition: 'margin-left 0.3s ease' }}>
            <style>{`.bookingTable table tbody tr:hover { background-color: #f0f5ff;cursor: pointer;transform: scale(1.01);transition: transform 0.2s ease, background-color 0.2s ease;}`}</style>
            <div className="bookingTable">
                <h2 className="text-center mb-4">Bookings</h2>
                <table className="table table-hover">
                    <thead className="table-dark text-center ">
                        <tr>
                            <th>S.no</th>
                            <th>User Name</th>
                            <th>Bike Name</th>
                            <th>Number Plate</th>
                            <th>Date & Time</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? bookings.map((booking, index) => (
                            <tr key={booking._id}>
                                <td>{index + 1}</td>
                                <td>{booking.user_id ? `${booking.user_id.firstName} ${booking.user_id.middleName} ${booking.user_id.lastName}` : "N/A"}</td>
                                <td>{booking.bike_name}</td>
                                <td>{booking.bike_numplate}</td>
                                <td>{new Date(booking.date_time).toLocaleString()}</td>
                                <td>{serviceMap[booking.bike_services] || booking.bike_services}</td>
                                <td>{booking.status}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center">No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;
