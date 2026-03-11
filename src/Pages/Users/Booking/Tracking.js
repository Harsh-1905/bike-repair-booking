import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import { showSuccess, showError } from "../../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./tracking.css";

// Bike data organized by company and type
const bikeData = {
    "Hero MotoCorp": {
        bikes: ["Hero Splendor Plus", "Hero HF Deluxe", "Hero Glamour", "Hero Passion Plus", "Hero Xtreme 160R"],
        scooters: ["Hero Pleasure+", "Hero Maestro Edge 125", "Hero Destini 125", "Hero Xoom 110", "Hero Duet"]
    },
    "Honda": {
        bikes: ["Honda Shine", "Honda SP125", "Honda Unicorn", "Honda Hornet 2.0", "Honda CB350"],
        scooters: ["Honda Activa", "Honda Activa 125", "Honda Dio", "Honda Grazia", "Honda Aviator"]
    },
    "Bajaj": {
        bikes: ["Bajaj Pulsar 125", "Bajaj Pulsar 150", "Bajaj Pulsar NS200", "Bajaj Platina 110", "Bajaj Dominar 400"],
        scooters: ["Bajaj Chetak (Electric)", "Bajaj Chetak Classic", "Bajaj Chetak Premium", "Bajaj Chetak Urbane", "Bajaj Crystal"]
    },
    "TVS": {
        bikes: ["TVS Raider 125", "TVS Apache RTR 160", "TVS Apache RTR 200", "TVS Sport", "TVS Star City Plus"],
        scooters: ["TVS Jupiter", "TVS Ntorq 125", "TVS Scooty Pep+", "TVS Zest 110", "TVS XL100"]
    },
    "Suzuki": {
        bikes: ["Suzuki Gixxer", "Suzuki Gixxer SF", "Suzuki V-Strom SX", "Suzuki Intruder", "Suzuki Hayabusa"],
        scooters: ["Suzuki Access 125", "Suzuki Burgman Street", "Suzuki Avenis", "Suzuki Swish", "Suzuki Let's"]
    }
};

const Tracking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editData, setEditData] = useState({});
    const [availableModels, setAvailableModels] = useState([]);
    const navigate = useNavigate();

    const companies = Object.keys(bikeData);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Update available models when company or bike type changes in edit mode
    useEffect(() => {
        if (editData.bikeCompany && editData.bikeType) {
            const type = editData.bikeType.toLowerCase() === "bike" ? "bikes" : "scooters";
            setAvailableModels(bikeData[editData.bikeCompany]?.[type] || []);
        } else {
            setAvailableModels([]);
        }
    }, [editData.bikeCompany, editData.bikeType]);

    const fetchBookings = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await api.get(`/booking/user/${user._id}`);
            
            // Filter only active bookings (not completed or cancelled)
            const activeBookings = response.data.data.filter(
                (booking) => booking.status !== "Completed" && booking.status !== "Cancelled"
            );
            
            setBookings(activeBookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            showError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await api.put(`/booking/${bookingId}`, { status: "Cancelled" });
            showSuccess("Booking cancelled successfully");
            fetchBookings();
        } catch (error) {
            console.error("Error cancelling booking:", error);
            showError("Failed to cancel booking");
        }
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking._id);
        setEditData({
            bikeCompany: booking.bikeCompany,
            bikeModel: booking.bikeModel,
            bikeType: booking.bikeType,
            bikeNumPlate: booking.bikeNumPlate,
            date: booking.date.split('T')[0],
            pickupDrop: booking.pickupDrop,
            remarks: booking.remarks,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/booking/${editingBooking}`, editData);
            showSuccess("Booking updated successfully");
            setEditingBooking(null);
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking:", error);
            showError("Failed to update booking");
        }
    };

    const handleCancelEdit = () => {
        setEditingBooking(null);
        setEditData({});
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "#ffc107";
            case "Confirmed":
                return "#17a2b8";
            case "In Progress":
                return "#007bff";
            case "Completed":
                return "#28a745";
            case "Cancelled":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };

    if (loading) {
        return (
            <div className="tracking-page">
                <div className="loading">Loading your bookings...</div>
            </div>
        );
    }

    return (
        <div className="tracking-page">
            <div className="tracking-container">
                <h1 className="tracking-title">
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> Track Your Bookings
                </h1>

                {bookings.length === 0 ? (
                    <div className="no-bookings">
                        <p>You have no active bookings</p>
                        <button onClick={() => navigate("/serviceselection")} className="book-btn">
                            Book a Service
                        </button>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-info">
                                        <h3>{booking.bikeService}</h3>
                                        <p className="booking-date">
                                            {new Date(booking.date).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div
                                        className="booking-status"
                                        style={{ backgroundColor: getStatusColor(booking.status) }}
                                    >
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span>Bike:</span>
                                        <strong>
                                            {booking.bikeCompany} {booking.bikeModel} ({booking.bikeType})
                                        </strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Number Plate:</span>
                                        <strong>{booking.bikeNumPlate}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Price:</span>
                                        <strong>₹{booking.price}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Pickup & Drop:</span>
                                        <strong>{booking.pickupDrop === "yes" ? "Yes" : "No"}</strong>
                                    </div>
                                    {booking.mechanic_id ? (
                                        <div className="detail-row mechanic-assigned">
                                            <span>Mechanic Assigned:</span>
                                            <div>
                                                <strong>{booking.mechanic_id.fullName}</strong>
                                                <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#555" }}>
                                                    {booking.mechanic_id.phone}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="detail-row">
                                            <span>Mechanic:</span>
                                            <strong style={{ color: "#999" }}>Not assigned yet</strong>
                                        </div>
                                    )}
                                    {booking.remarks && (
                                        <div className="detail-row">
                                            <span>Remarks:</span>
                                            <p>{booking.remarks}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="booking-actions">
                                    {booking.status === "Pending" && (
                                        <>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditBooking(booking)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </button>
                                            <button
                                                className="btn-cancel"
                                                onClick={() => handleCancelBooking(booking._id)}
                                            >
                                                <FontAwesomeIcon icon={faTimes} /> Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingBooking && (
                <div className="modal-overlay" onClick={handleCancelEdit}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Booking</h3>
                            <button className="close-btn" onClick={handleCancelEdit}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bike Type</label>
                                    <select
                                        className="form-control"
                                        value={editData.bikeType}
                                        onChange={(e) => {
                                            setEditData({ ...editData, bikeType: e.target.value, bikeCompany: "", bikeModel: "" });
                                        }}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Bike">Bike</option>
                                        <option value="Moped">Moped</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Bike Company</label>
                                    <select
                                        className="form-control"
                                        value={editData.bikeCompany}
                                        onChange={(e) => {
                                            setEditData({ ...editData, bikeCompany: e.target.value, bikeModel: "" });
                                        }}
                                        disabled={!editData.bikeType}
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company}>
                                                {company}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bike Model</label>
                                    <select
                                        className="form-control"
                                        value={editData.bikeModel}
                                        onChange={(e) =>
                                            setEditData({ ...editData, bikeModel: e.target.value })
                                        }
                                        disabled={!editData.bikeCompany || !editData.bikeType}
                                    >
                                        <option value="">Select Model</option>
                                        {availableModels.map((model, index) => (
                                            <option key={index} value={model}>
                                                {model}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Number Plate</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editData.bikeNumPlate}
                                        onChange={(e) =>
                                            setEditData({ ...editData, bikeNumPlate: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Service Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={editData.date}
                                        onChange={(e) =>
                                            setEditData({ ...editData, date: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pickup & Drop</label>
                                    <select
                                        className="form-control"
                                        value={editData.pickupDrop}
                                        onChange={(e) =>
                                            setEditData({ ...editData, pickupDrop: e.target.value })
                                        }
                                    >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Remarks</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={editData.remarks}
                                    onChange={(e) =>
                                        setEditData({ ...editData, remarks: e.target.value })
                                    }
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn-cancel-modal" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button className="btn-save" onClick={handleSaveEdit}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tracking;
