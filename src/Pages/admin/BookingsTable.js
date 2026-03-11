import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showSuccess, showError } from "../../utils/toast";

const BookingTable = ({ isCollapsed }) => {

    const [bookings, setBookings] = useState([]);
    const [mechanics, setMechanics] = useState([]);

    useEffect(() => {
        fetchBookings();
        fetchMechanics();
    }, []);

    const fetchBookings = () => {

        api.get("/bookings")
            .then(res => {

                if (res.data.success) {
                    // Filter only active bookings (not completed or cancelled)
                    const activeBookings = res.data.data.filter(
                        (booking) => booking.status !== "Completed" && booking.status !== "Cancelled"
                    );
                    setBookings(activeBookings);
                }

            })
            .catch(err => console.error(err));

    };

    const fetchMechanics = async () => {
        try {
            const response = await api.get("/mechanics/available");
            setMechanics(response.data);
        } catch (error) {
            console.error("Error fetching mechanics:", error);
        }
    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(`/booking/${id}`, { status });

            setBookings(prev =>
                prev.map(b =>
                    b._id === id ? { ...b, status } : b
                )
            );

            showSuccess("Status updated successfully");

        } catch (err) {
            console.error(err);
            showError("Failed to update status");
        }

    };

    const assignMechanic = async (bookingId, mechanicId) => {
        try {
            await api.put(`/booking/${bookingId}`, { mechanic_id: mechanicId });

            setBookings(prev =>
                prev.map(b =>
                    b._id === bookingId ? { ...b, mechanic_id: mechanicId } : b
                )
            );

            showSuccess("Mechanic assigned successfully");
        } catch (err) {
            console.error(err);
            showError("Failed to assign mechanic");
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

            <h2 className="mb-3">Booking Management - Active Bookings</h2>

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
                                <th>Assigned Mechanic</th>
                                <th>Assign</th>
                                <th>Status</th>
                                <th>Update</th>
                            </tr>

                        </thead>

                        <tbody>

                            {bookings.length > 0 ? (

                                bookings.map((booking) => (

                                    <tr key={booking._id}>

                                        <td style={{ width: "10%" }}>
                                            {booking.user_id
                                                ? booking.user_id.fullName
                                                : "N/A"}
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            {booking.bikeCompany} {booking.bikeModel}
                                        </td>

                                        <td style={{ width: "8%" }}>
                                            {booking.bikeNumPlate}
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            {booking.bikeService}
                                        </td>

                                        <td style={{ width: "12%" }}>
                                            {booking.remarks || "—"}
                                        </td>

                                        <td style={{ width: "12%" }}>
                                            {booking.mechanic_id ? (
                                                <div>
                                                    <div style={{ fontWeight: "600", color: "#28a745" }}>
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

                                        <td style={{ width: "13%" }}>
                                            <select
                                                className="form-select form-select-sm"
                                                value={booking.mechanic_id?._id || ""}
                                                onChange={(e) =>
                                                    assignMechanic(booking._id, e.target.value)
                                                }
                                                disabled={booking.status === "Completed"}
                                            >
                                                <option value="">Select Mechanic</option>
                                                {mechanics.map((mechanic) => (
                                                    <option key={mechanic._id} value={mechanic._id}>
                                                        {mechanic.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td style={{ width: "10%" }}>
                                            <span className={getStatusClass(booking.status)}>
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td style={{ width: "15%" }}>

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

                                            </select>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="9" className="text-center p-3">
                                        No active bookings found
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