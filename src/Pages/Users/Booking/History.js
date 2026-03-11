import React, { useEffect, useState } from "react";
import api from "../../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMotorcycle, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "./history.css";

const History = () => {
    const [bookings, setBookings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("bookings");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            // Fetch bookings
            api.get(`/booking/user/${user._id}`)
                .then((res) => {
                    // Filter only completed and cancelled bookings
                    const pastBookings = res.data.data.filter(
                        (booking) => booking.status === "Completed" || booking.status === "Cancelled"
                    );
                    setBookings(pastBookings);
                })
                .catch((err) => console.error(err));

            // Fetch orders
            api.get(`/orders/user`)
                .then((res) => {
                    if (res.data && Array.isArray(res.data)) {
                        // Filter only completed and cancelled orders
                        const pastOrders = res.data.filter(
                            (order) => order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
                        );
                        setOrders(pastOrders);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
            case "Delivered":
                return "badge bg-success";
            case "Cancelled":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    const getStatusText = (status) => {
        return status;
    };

    return (
        <div style={{ padding: "40px 20px", minHeight: "100vh", background: "linear-gradient(135deg, #fff8e1, #ffd6cc, #f97673)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2 className="text-center mb-4" style={{ fontSize: "2.5rem", fontWeight: "700", color: "#333" }}>
                    History
                </h2>

                {/* Tabs */}
                <div className="tabs mb-4" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
                        onClick={() => setActiveTab("bookings")}
                        style={{
                            padding: "12px 30px",
                            background: activeTab === "bookings" ? "#E43636" : "rgba(255, 255, 255, 0.9)",
                            color: activeTab === "bookings" ? "white" : "#333",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <FontAwesomeIcon icon={faMotorcycle} />
                        Service Bookings ({bookings.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                        style={{
                            padding: "12px 30px",
                            background: activeTab === "orders" ? "#E43636" : "rgba(255, 255, 255, 0.9)",
                            color: activeTab === "orders" ? "white" : "#333",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <FontAwesomeIcon icon={faShoppingBag} />
                        Product Orders ({orders.length})
                    </button>
                </div>

                {/* Bookings Tab */}
                {activeTab === "bookings" && (
                    <>
                        {bookings.length === 0 ? (
                            <div className="empty-state">
                                <p>No past service bookings found</p>
                            </div>
                        ) : (
                            <div className="history-table-container">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Bike</th>
                                            <th>Number Plate</th>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking._id} className="history-table-row">
                                                <td>
                                                    <div className="bike-info">
                                                        <span className="bike-company">{booking.bikeCompany}</span>
                                                        <span className="bike-model">{booking.bikeModel}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="number-plate">{booking.bikeNumPlate}</span>
                                                </td>
                                                <td>
                                                    <span className="service-name">{booking.bikeService}</span>
                                                </td>
                                                <td>
                                                    <span className="booking-date">
                                                        {new Date(booking.date).toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="booking-price">₹{booking.price}</span>
                                                </td>
                                                <td>
                                                    <span className={getStatusClass(booking.status) + " status-badge"}>
                                                        {getStatusText(booking.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <>
                        {orders.length === 0 ? (
                            <div className="empty-state">
                                <p>No past product orders found</p>
                            </div>
                        ) : (
                            <div className="history-table-container">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Items</th>
                                            <th>Total Amount</th>
                                            <th>Payment</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id} className="history-table-row">
                                                <td>
                                                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                                </td>
                                                <td>
                                                    <span className="items-count">{order.items.length} item(s)</span>
                                                </td>
                                                <td>
                                                    <span className="order-total">₹{order.totalAmount}</span>
                                                </td>
                                                <td>
                                                    <span className="payment-method">{order.paymentMethod}</span>
                                                </td>
                                                <td>
                                                    <span className="order-date">
                                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={getStatusClass(order.orderStatus) + " status-badge"}>
                                                        {getStatusText(order.orderStatus)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default History;
