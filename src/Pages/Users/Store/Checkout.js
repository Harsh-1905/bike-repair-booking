import React, { useState } from "react";
import { useCart } from "./Cartcontext";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import { showSuccess, showError } from "../../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { 
    loadRazorpayScript, 
    initializeRazorpayPayment, 
    validatePaymentResponse,
    createProductPaymentOrder,
    verifyProductPayment
} from "../../../utils/razorpay";
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
            if (paymentMethod === "COD") {
                await handleCODOrder();
            } else {
                await handleUPIOrder();
            }
        } catch (error) {
            console.error("Order error:", error);
            showError(error.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const handleCODOrder = async () => {
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
            paymentMethod: "COD",
            paymentStatus: "pending"
        };

        const response = await api.post("/orders", orderData);
        showSuccess("Order placed successfully!");
        navigate(`/order-success/${response.data.order._id}`);
    };

    const handleUPIOrder = async () => {
        // Load Razorpay script
        const isRazorpayLoaded = await loadRazorpayScript();
        if (!isRazorpayLoaded) {
            throw new Error("Failed to load Razorpay. Please check your internet connection.");
        }

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
            paymentMethod: "Online",
            email: user.email
        };

        // Create Razorpay order
        const orderResponse = await createProductPaymentOrder(api, orderData, totalPrice);

        if (!orderResponse.success) {
            throw new Error(orderResponse.message || "Failed to create payment order");
        }

        const { order, key_id } = orderResponse;

        // Razorpay options for UPI-only payment
        const options = {
            key: key_id,
            amount: order.amount,
            currency: order.currency,
            name: "BikeCare Store",
            description: `Order for ${cartItems.length} items`,
            order_id: order.id,
            prefill: {
                name: formData.fullName || user?.fullName || "",
                email: user?.email || "",
                contact: formData.phone || user?.contactNumber || ""
            },
            theme: {
                color: "#E43636"
            },
            notes: {
                order_type: "product",
                item_count: cartItems.length,
                customer_email: user.email
            },
            // UPI-only configuration
            config: {
                display: {
                    blocks: {
                        utib: {
                            name: 'Pay using UPI',
                            instruments: [
                                {
                                    method: 'upi'
                                }
                            ]
                        }
                    },
                    sequence: ['block.utib'],
                    preferences: {
                        show_default_blocks: false
                    }
                }
            }
        };

        try {
            // Open Razorpay checkout with UPI-only
            const paymentResponse = await initializeRazorpayPayment(options);
            
            if (validatePaymentResponse(paymentResponse)) {
                // Verify payment on backend
                const verifyResponse = await verifyProductPayment(api, paymentResponse, orderData);
                
                if (verifyResponse.success) {
                    showSuccess("Payment successful! Order placed.");
                    navigate(`/order-success/${verifyResponse.data._id}`);
                } else {
                    throw new Error(verifyResponse.message || "Payment verification failed");
                }
            } else {
                throw new Error("Invalid payment response");
            }
        } catch (error) {
            if (error.message === 'Payment cancelled by user') {
                showError("Payment cancelled");
            } else {
                throw error;
            }
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
                                            <span>UPI Payment (PhonePe, GPay, Paytm, etc.)</span>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        paymentMethod === "Online" ? "Processing UPI Payment..." : "Placing Order..."
                                    ) : (
                                        paymentMethod === "Online" ? "Pay with UPI" : "Place Order"
                                    )}
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
