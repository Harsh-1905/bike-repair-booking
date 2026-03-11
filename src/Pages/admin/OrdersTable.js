import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./orders-table.css";

const OrdersTable = ({ isCollapsed }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/all");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            
            if (error.response?.status === 401) {
                showError("Please login as admin to view orders");
            } else {
                showError(error.response?.data?.message || "Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!newStatus) {
            showError("Please select a status");
            return;
        }

        try {
            await api.put(`/orders/${selectedOrder._id}/status`, {
                orderStatus: newStatus,
            });
            showSuccess("Order status updated successfully");
            setShowModal(false);
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
            showError("Failed to update order status");
        }
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.orderStatus);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "#ffc107";
            case "Processing":
                return "#17a2b8";
            case "Shipped":
                return "#007bff";
            case "Delivered":
                return "#28a745";
            case "Cancelled":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };

    if (loading) {
        return <div className="loading-container">Loading orders...</div>;
    }

    return (
        <div 
            className="orders-table-container"
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                transition: "margin-left 0.3s ease"
            }}
        >
            <div className="orders-header">
                <h2>Order Management</h2>
                <p>Total Orders: {orders.length}</p>
            </div>

            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>#{order._id.slice(-8)}</td>
                                <td>
                                    <div className="customer-info">
                                        <p className="customer-name">
                                            {order.shippingAddress.fullName}
                                        </p>
                                        <p className="customer-phone">
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </td>
                                <td>{order.items.length} items</td>
                                <td className="amount">₹{order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <span className="payment-badge">{order.paymentMethod}</span>
                                </td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td>
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-view"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            title="View Details"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="btn-edit"
                                            onClick={() => openStatusModal(order)}
                                            title="Update Status"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="order-detail-section">
                                <h4>Order Information</h4>
                                <p>
                                    <strong>Order ID:</strong> {selectedOrder._id}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                                </p>
                                <p>
                                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                                </p>
                            </div>

                            <div className="order-detail-section">
                                <h4>Shipping Address</h4>
                                <p>{selectedOrder.shippingAddress.fullName}</p>
                                <p>{selectedOrder.shippingAddress.phone}</p>
                                <p>{selectedOrder.shippingAddress.address}</p>
                                <p>
                                    {selectedOrder.shippingAddress.city},{" "}
                                    {selectedOrder.shippingAddress.state} -{" "}
                                    {selectedOrder.shippingAddress.pincode}
                                </p>
                            </div>

                            <div className="order-detail-section">
                                <h4>Items</h4>
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="order-item-detail">
                                        <img
                                            src={`http://localhost:8000/uploads/productimages/${item.image}`}
                                            alt={item.name}
                                        />
                                        <div className="item-info">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-qty">Quantity: {item.quantity}</p>
                                            <p className="item-price">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-detail-section">
                                <h4>Update Status</h4>
                                <select
                                    className="status-select"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                <button className="btn-update" onClick={handleStatusUpdate}>
                                    Update Status
                                </button>
                            </div>

                            <div className="order-total">
                                <strong>Total Amount:</strong> ₹
                                {selectedOrder.totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTable;
