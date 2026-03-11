import React from "react";
import { useCart } from "./Cartcontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { showInfo } from "../../../utils/toast";
import { getProductImageURL } from "../../../utils/config";
import "./cart.css";

const Cart = () => {
    const { cartItems, removeFromCart, increaseQty, decreaseQty } = useCart();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleRemoveItem = (item) => {
        removeFromCart(item._id);
        showInfo(`${item.name} removed from cart`);
    };

    return (
        <div className="cart-page-wrapper">
            <div className="cart-header">
                <button className="back-btn" onClick={() => navigate("/store")}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
                </button>
                <h1 className="cart-title">
                    <FontAwesomeIcon icon={faShoppingCart} /> Shopping Cart
                </h1>
                <p className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <FontAwesomeIcon icon={faShoppingCart} className="empty-cart-icon" />
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <button className="shop-now-btn" onClick={() => navigate("/store")}>
                        Shop Now
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-section">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item-card">
                                <div className="cart-item-image">
                                    <img
                                        src={getProductImageURL(item.image)}
                                        alt={item.name}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    <p className="item-price">₹{item.price.toFixed(2)}</p>
                                    <div className="qty-section">
                                        <label>Quantity:</label>
                                        <div className="qty-controls">
                                            <button 
                                                className="qty-btn" 
                                                onClick={() => decreaseQty(item._id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button 
                                                className="qty-btn" 
                                                onClick={() => increaseQty(item._id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="item-subtotal">
                                        Subtotal: <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                                    </p>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item)}
                                    title="Remove from cart"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-section">
                        <div className="summary-card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal ({totalItems} items)</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <hr />
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span className="total-price">₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                                Proceed to Checkout
                            </button>
                            <p className="secure-checkout">🔒 Secure Checkout</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
