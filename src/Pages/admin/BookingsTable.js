import React, { useEffect, useState } from "react";
import api from "../../Api/axios";

const BookingTable = ({ isCollapsed }) => {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {

        api.get("/bookings")
            .then(res => {

                if (res.data.success) {
                    setBookings(res.data.data);
                }

            })
            .catch(err => console.error(err));

    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(`/booking/${id}`, { status });

            setBookings(prev =>
                prev.map(b =>
                    b._id === id ? { ...b, status } : b
                )
            );

        } catch (err) {
            console.error(err);
        }

    };

    const getStatusClass = (status) => {

        switch (status) {

            case "Pending":
                return "badge bg-warning text-dark";

            case "Confirmed":
                return "badge bg-primary";

            case "In Progress":
                return "badge bg-info";

            case "Completed":
                return "badge bg-success";

            case "Cancelled":
                return "badge bg-danger";

            default:
                return "badge bg-secondary";

        }

    };

    return (

        <div
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                padding: "20px",
                transition: "margin-left 0.3s ease"
            }}
        >

            <h2 className="mb-3">All Bookings</h2>

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <table className="table table-sm table-hover align-middle mb-0">

                        <thead className="table-dark">

                            <tr>
                                <th>Owner</th>
                                <th>Bike</th>
                                <th>Number</th>
                                <th>Service</th>
                                <th>Problem</th>
                                <th>Status</th>
                                <th>Update</th>
                            </tr>

                        </thead>

                        <tbody>

                            {bookings.length > 0 ? (

                                bookings.map((booking) => (

                                    <tr key={booking._id}>

                                        <td style={{ width: "15%" }}>
                                            {booking.user_id
                                                ? `${booking.user_id.firstName} ${booking.user_id.lastName}`
                                                : "N/A"}
                                        </td>

                                        <td style={{ width: "15%" }}>
                                            {booking.bikeCompany} {booking.bikeModel}
                                        </td>

                                        <td style={{ width: "12%" }}>
                                            {booking.bikeNumPlate}
                                        </td>

                                        <td style={{ width: "15%" }}>
                                            {booking.bikeService}
                                        </td>

                                        <td style={{ width: "20%" }}>
                                            {booking.remarks || "—"}
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            <span className={getStatusClass(booking.status)}>
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td style={{ width: "13%" }}>

                                            <select
                                                className="form-select form-select-sm"
                                                value={booking.status}
                                                onChange={(e) =>
                                                    updateStatus(booking._id, e.target.value)
                                                }
                                            >

                                                <option>Pending</option>
                                                <option>Confirmed</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                                <option>Cancelled</option>

                                            </select>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="7" className="text-center p-3">
                                        No bookings found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};

export default BookingTable;