import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag} from "@fortawesome/free-solid-svg-icons";
import { showSuccess, showError } from "../../../utils/toast";
import "./my-orders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/user");
            // Filter out delivered and cancelled orders - show only active orders
            const activeOrders = response.data.filter(order => 
                order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
            );
            setOrders(activeOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            
            if (error.response?.status === 401) {
                showError("Please login to view orders");
            } else {
                showError(error.response?.data?.message || "Failed to load orders");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            await api.put(`/orders/${orderId}/cancel`);
            showSuccess("Order cancelled successfully");
            fetchOrders(); // Refresh orders list
        } catch (error) {
            console.error("Error cancelling order:", error);
            showError(error.response?.data?.message || "Failed to cancel order");
        }
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
        return (
            <div className="my-orders-page">
                <div className="loading">Loading your orders...</div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="orders-container">
                <h1 className="orders-title">
                    <FontAwesomeIcon icon={faShoppingBag} /> My Orders
                </h1>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>You have no active orders</p>
                        <p className="no-orders-sub">Completed and cancelled orders can be viewed in History</p>
                        <button onClick={() => navigate("/store")} className="shop-btn">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <p className="order-id">Order #{order._id.slice(-8)}</p>
                                        <p className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div
                                        className="order-status"
                                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                    >
                                        {order.orderStatus}
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img
                                                src={`http://localhost:8000/uploads/productimages/${item.image}`}
                                                alt={item.name}
                                            />
                                            <div className="item-info">
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-qty">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="item-price">₹{item.price.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span>Total Amount:</span>
                                        <strong>₹{order.totalAmount.toFixed(2)}</strong>
                                    </div>
                                    
                                    <div className="order-actions">
                                        {order.orderStatus === "Pending" && (
                                            <button 
                                                className="cancel-order-btn"
                                                onClick={() => handleCancelOrder(order._id)}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
