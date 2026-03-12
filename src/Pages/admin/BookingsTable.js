import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMotorcycle, 
    faUser, 
    faCalendarAlt, 
    faWrench, 
    faCheckCircle,
    faClock,
    faExclamationTriangle,
    faSpinner,
    faRupeeSign,
    faCommentDots,
    faEye,
    faTimes,
    faList
} from "@fortawesome/free-solid-svg-icons";
import "./admin-tables.css";

const BookingTable = ({ isCollapsed }) => {
    const [bookings, setBookings] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showServicesModal, setShowServicesModal] = useState(false);

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
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "Pending": return faExclamationTriangle;
            case "Confirmed": return faCheckCircle;
            case "In Progress": return faSpinner;
            case "Completed": return faCheckCircle;
            case "Cancelled": return faExclamationTriangle;
            default: return faClock;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#ffc107";
            case "Confirmed": return "#17a2b8";
            case "In Progress": return "#007bff";
            case "Completed": return "#28a745";
            case "Cancelled": return "#dc3545";
            default: return "#6c757d";
        }
    };

    const handleViewServices = (booking) => {
        setSelectedBooking(booking);
        setShowServicesModal(true);
    };

    const closeServicesModal = () => {
        setShowServicesModal(false);
        setSelectedBooking(null);
    };

    if (loading) {
        return (
            <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
                <div className="admin-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p>Loading active bookings...</p>
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
                            <FontAwesomeIcon icon={faMotorcycle} />
                        </div>
                        <div className="header-text">
                            <h1>Booking Management</h1>
                            <p>Manage active service bookings</p>
                        </div>
                    </div>
                    <div className="stats-badge">
                        <span className="stats-number">{bookings.length}</span>
                        <span className="stats-label">Active Bookings</span>
                    </div>
                </div>

                <div className="simple-table-card">
                    <div className="table-header">
                        <h3>
                            <FontAwesomeIcon icon={faWrench} className="me-2" />
                            Active Service Bookings
                        </h3>
                    </div>
                    
                    <div className="simple-table-container">
                        <table className="simple-table booking-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Service</th>
                                    <th>Booked On</th>
                                    <th>Service Date</th>
                                    <th>Price</th>
                                    <th>Problem</th>
                                    <th>Mechanic</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((booking) => (
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
                                        <td>
                                            <div className="service-info">
                                                <span className="service-name">{booking.bikeService}</span>
                                                {booking.bikeService === "Customize Service" && booking.selectedServices && booking.selectedServices.length > 0 && (
                                                    <button 
                                                        className="view-more-btn"
                                                        onClick={() => handleViewServices(booking)}
                                                        title="View selected services"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                        <span>View More</span>
                                                    </button>
                                                )}
                                            </div>
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
                                        <td className="price-cell">₹{booking.price}</td>
                                        <td className="problem-cell">
                                            {booking.remarks || "—"}
                                        </td>
                                        <td>
                                            <div className="mechanic-cell">
                                                {booking.mechanic_id ? (
                                                    <div className="mechanic-assigned">
                                                        <div className="mechanic-name">
                                                            {booking.mechanic_id.fullName}
                                                        </div>
                                                        <div className="mechanic-phone">
                                                            {booking.mechanic_id.phone}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="no-mechanic">Not assigned</span>
                                                )}
                                                <select
                                                    className="mechanic-select"
                                                    value={booking.mechanic_id?._id || ""}
                                                    onChange={(e) => assignMechanic(booking._id, e.target.value)}
                                                    disabled={booking.status === "Completed"}
                                                >
                                                    <option value="">Select Mechanic</option>
                                                    {mechanics.map((mechanic) => (
                                                        <option key={mechanic._id} value={mechanic._id}>
                                                            {mechanic.fullName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-cell">
                                                <div className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
                                                    {booking.status}
                                                </div>
                                                <select
                                                    className="status-select"
                                                    value={booking.status}
                                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                >
                                                    <option>Pending</option>
                                                    <option>Confirmed</option>
                                                    <option>In Progress</option>
                                                    <option>Completed</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="empty-row">
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faMotorcycle} className="empty-icon" />
                                                <span>No active bookings found</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Services Modal */}
                {showServicesModal && selectedBooking && (
                    <div className="modal-overlay" onClick={closeServicesModal}>
                        <div className="services-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>
                                    <FontAwesomeIcon icon={faList} />
                                    Selected Services
                                </h3>
                                <button className="close-btn" onClick={closeServicesModal}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="booking-info-header">
                                    <h4>{selectedBooking.bikeCompany} {selectedBooking.bikeModel}</h4>
                                    <p>Number Plate: {selectedBooking.bikeNumPlate}</p>
                                    <p>Customer: {selectedBooking.user_id?.fullName}</p>
                                </div>
                                <div className="services-list">
                                    <h5>Selected Services:</h5>
                                    {selectedBooking.selectedServices && selectedBooking.selectedServices.length > 0 ? (
                                        <div className="services-grid">
                                            {selectedBooking.selectedServices.map((service, index) => (
                                                <div key={index} className="service-item">
                                                    <div className="service-details">
                                                        <span className="service-name">{service.name}</span>
                                                        <span className="service-price">₹{service.price}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-services">No services selected</p>
                                    )}
                                    <div className="total-section">
                                        <div className="total-row">
                                            <span>Total Amount:</span>
                                            <span className="total-price">₹{selectedBooking.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingTable;