import React, { useState } from "react";
import { useCart } from "./Cartcontext";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import { showSuccess, showError } from "../../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import "./checkout.css";

const Checkout = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            showError("Your cart is empty");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            showError("Please login to place order");
            navigate("/signin");
            return;
        }

        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            
            const orderData = {
                user_id: user._id,
                items: cartItems.map((item) => ({
                    product_id: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingAddress: formData,
                totalAmount: totalPrice,
                paymentMethod,
            };

            const response = await api.post("/orders", orderData);

            showSuccess("Order placed successfully!");
            navigate(`/order-success/${response.data.order._id}`);
        } catch (error) {
            console.error("Order error:", error);
            showError(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="empty-checkout">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate("/store")} className="shop-btn">
                        Go to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <button className="back-btn" onClick={() => navigate("/cart")}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Cart
                </button>

                <h1 className="checkout-title">
                    <FontAwesomeIcon icon={faShoppingBag} /> Checkout
                </h1>

                <div className="checkout-content">
                    <div className="checkout-form-section">
                        <div className="form-card">
                            <h3>Shipping Address</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="3"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="payment-section">
                                    <h3>Payment Method</h3>
                                    <div className="payment-options">
                                        <label className="payment-option">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="COD"
                                                checked={paymentMethod === "COD"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>Cash on Delivery</span>
                                        </label>
                                        <label className="payment-option">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Online"
                                                checked={paymentMethod === "Online"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span>Online Payment (Coming Soon)</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={loading || paymentMethod === "Online"}
                                >
                                    {loading ? "Placing Order..." : "Place Order"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="order-summary-section">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="order-items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="summary-item">
                                        <img
                                            src={`http://localhost:8000/uploads/productimages/${item.image}`}
                                            alt={item.name}
                                        />
                                        <div className="item-info">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="item-price">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-text">FREE</span>
                            </div>
                            <hr />
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span className="total-price">₹{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
