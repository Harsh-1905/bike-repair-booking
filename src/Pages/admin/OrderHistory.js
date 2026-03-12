import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHistory, 
    faShoppingCart, 
    faUser, 
    faCalendarAlt, 
    faCheckCircle,
    faTimesCircle,
    faRupeeSign,
    faEye,
    faTimes,
    faBox
} from "@fortawesome/free-solid-svg-icons";
import "./admin-tables.css";

const OrderHistory = ({ isCollapsed }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, delivered, cancelled
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/all");
            // Filter only delivered and cancelled orders
            const historyOrders = response.data.filter(
                (order) => order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
            );
            setOrders(historyOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "#28a745";
            case "Cancelled": return "#dc3545";
            default: return "#6c757d";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered": return faCheckCircle;
            case "Cancelled": return faTimesCircle;
            default: return faHistory;
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return order.orderStatus.toLowerCase() === filter;
    });

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="admin-page" style={{ marginLeft: isCollapsed ? '80px' : '250px' }}>
                <div className="admin-container">
                    <div className="loading-card">
                        <div className="loading-spinner"></div>
                        <p>Loading order history...</p>
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
                            <h1>Order History</h1>
                            <p>View delivered and cancelled orders</p>
                        </div>
                    </div>
                    <div className="stats-badge">
                        <span className="stats-number">{orders.length}</span>
                        <span className="stats-label">Total History</span>
                    </div>
                </div>

                <div className="simple-table-card">
                    <div className="table-header">
                        <h3>
                            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                            Order History
                        </h3>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                All ({orders.length})
                            </button>
                            <button
                                className={`filter-btn ${filter === "delivered" ? "active" : ""}`}
                                onClick={() => setFilter("delivered")}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                Delivered ({orders.filter((o) => o.orderStatus === "Delivered").length})
                            </button>
                            <button
                                className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
                                onClick={() => setFilter("cancelled")}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} />
                                Cancelled ({orders.filter((o) => o.orderStatus === "Cancelled").length})
                            </button>
                        </div>
                    </div>
                    
                    <div className="simple-table-container">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Payment Method</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="subject-cell">
                                            #{order._id.slice(-8)}
                                        </td>
                                        <td className="name-cell">
                                            <div>
                                                <div>{order.shippingAddress.fullName}</div>
                                                <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                    {order.shippingAddress.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                        </td>
                                        <td className="subject-cell">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </td>
                                        <td>
                                            <span style={{
                                                background: '#f8f9fa',
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '0.8rem',
                                                color: '#495057'
                                            }}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            <div className="date-value">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                            <div className="time-value">
                                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true
                                                })}
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className="status-badge" 
                                                style={{ 
                                                    backgroundColor: getStatusColor(order.orderStatus),
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => openOrderModal(order)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #E43636, #c72828)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                                title="View Details"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="empty-row">
                                            <div className="empty-state">
                                                <FontAwesomeIcon icon={faHistory} className="empty-icon" />
                                                <span>No order history found for the selected filter</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Details Modal */}
                {showModal && selectedOrder && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="services-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>
                                    <FontAwesomeIcon icon={faBox} />
                                    Order Details
                                </h3>
                                <button className="close-btn" onClick={closeModal}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="booking-info-header">
                                    <h4>Order #{selectedOrder._id.slice(-8)}</h4>
                                    <p>Status: <span style={{ color: getStatusColor(selectedOrder.orderStatus), fontWeight: '600' }}>{selectedOrder.orderStatus}</span></p>
                                    <p>Date: {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}</p>
                                    <p>Payment: {selectedOrder.paymentMethod}</p>
                                </div>

                                <div className="services-list">
                                    <h5>Shipping Address:</h5>
                                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                                        <p style={{ margin: '5px 0', fontWeight: '600' }}>{selectedOrder.shippingAddress.fullName}</p>
                                        <p style={{ margin: '5px 0' }}>{selectedOrder.shippingAddress.phone}</p>
                                        <p style={{ margin: '5px 0' }}>{selectedOrder.shippingAddress.address}</p>
                                        <p style={{ margin: '5px 0' }}>
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                                        </p>
                                    </div>

                                    <h5>Ordered Items:</h5>
                                    <div className="services-grid">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="service-item">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <img
                                                        src={`http://localhost:8000/uploads/productimages/${item.image}`}
                                                        alt={item.name}
                                                        style={{
                                                            width: '60px',
                                                            height: '60px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px'
                                                        }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div className="service-name">{item.name}</div>
                                                        <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                                            Quantity: {item.quantity}
                                                        </div>
                                                    </div>
                                                    <div className="service-price">₹{item.price.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="total-section">
                                        <div className="total-row">
                                            <span>Total Amount:</span>
                                            <span className="total-price">₹{selectedOrder.totalAmount.toFixed(2)}</span>
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

export default OrderHistory;