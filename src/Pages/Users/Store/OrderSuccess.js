import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./Cartcontext";
import api from "../../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faHome, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "./order-success.css";

const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clear cart after successful order
        cartItems.forEach((item) => {
            removeFromCart(item._id);
        });

        // Fetch order details
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="order-success-page">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="order-success-page">
            <div className="success-container">
                <div className="success-icon">
                    <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <h1>Order Placed Successfully!</h1>
                <p className="success-message">
                    Thank you for your order. We'll send you a confirmation email shortly.
                </p>

                {order && (
                    <div className="order-details-card">
                        <h3>Order Details</h3>
                        <div className="detail-row">
                            <span>Order ID:</span>
                            <strong>{order._id}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Total Amount:</span>
                            <strong>₹{order.totalAmount.toFixed(2)}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Payment Method:</span>
                            <strong>{order.paymentMethod}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Status:</span>
                            <strong className="status-badge">{order.orderStatus}</strong>
                        </div>

                        <div className="shipping-info">
                            <h4>Shipping Address</h4>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                {order.shippingAddress.pincode}
                            </p>
                        </div>

                        <div className="order-items">
                            <h4>Items Ordered</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <img
                                        src={`http://localhost:8000/uploads/productimages/${item.image}`}
                                        alt={item.name}
                                    />
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-qty">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">₹{item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="action-buttons">
                    <button className="btn-home" onClick={() => navigate("/userhomepage")}>
                        <FontAwesomeIcon icon={faHome} /> Go to Home
                    </button>
                    <button className="btn-orders" onClick={() => navigate("/my-orders")}>
                        <FontAwesomeIcon icon={faShoppingBag} /> View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
