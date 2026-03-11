import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMotorcycle, faShoppingBag, faCalendarCheck, 
    faTools, faBolt, faUser, faHistory, faStore
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./user-home.css";

const UserHome = () => {
    const [latestBooking, setLatestBooking] = useState(null);
    const [latestOrder, setLatestOrder] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        // Fetch bookings
        api.get(`/booking/user/${user._id}`)
            .then(res => {
                if (isMounted && res.data.success) {
                    const bookings = res.data.data;
                    setTotalBookings(bookings.length);
                    if (bookings.length > 0) {
                        setLatestBooking(bookings[0]);
                    }
                }
            })
            .catch(err => console.error("Error fetching bookings:", err));

        // Fetch orders
        api.get(`/orders/user`)
            .then(res => {
                if (isMounted && res.data && Array.isArray(res.data)) {
                    const orders = res.data;
                    setTotalOrders(orders.length);
                    if (orders.length > 0) {
                        setLatestOrder(orders[0]);
                    }
                }
            })
            .catch(err => console.error("Error fetching orders:", err));

        return () => {
            isMounted = false;
        };
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#ffc107";
            case "Confirmed": return "#17a2b8";
            case "In Progress": return "#007bff";
            case "Processing": return "#17a2b8";
            case "Shipped": return "#007bff";
            case "Delivered": return "#28a745";
            case "Completed": return "#28a745";
            case "Cancelled": return "#dc3545";
            default: return "#6c757d";
        }
    };

    return (
        <div className="user-home-page">
            {/* HERO SECTION */}
            <div className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <div className="hero-text">
                        <h1>Welcome back, {user?.fullName}! 👋</h1>
                        <p>Manage your bike services, track orders, and keep your ride in top shape.</p>
                        <div className="hero-buttons">
                            <button className="hero-btn primary" onClick={() => navigate('/serviceselection')}>
                                <FontAwesomeIcon icon={faMotorcycle} /> Book Service
                            </button>
                            <button className="hero-btn secondary" onClick={() => navigate('/store')}>
                                <FontAwesomeIcon icon={faShoppingBag} /> Shop Parts
                            </button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="floating-card card-1">
                            <FontAwesomeIcon icon={faMotorcycle} />
                            <span>Service Booking</span>
                        </div>
                        <div className="floating-card card-2">
                            <FontAwesomeIcon icon={faTools} />
                            <span>Expert Care</span>
                        </div>
                        <div className="floating-card card-3">
                            <FontAwesomeIcon icon={faShoppingBag} />
                            <span>Quality Parts</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container dashboard-content">
                {/* STATS CARDS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faMotorcycle} />
                        </div>
                        <div className="stat-info">
                            <h3>{totalBookings}</h3>
                            <p>Total Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faShoppingBag} />
                        </div>
                        <div className="stat-info">
                            <h3>{totalOrders}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faCalendarCheck} />
                        </div>
                        <div className="stat-info">
                            <h3>{totalBookings + totalOrders}</h3>
                            <p>Total Services</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <FontAwesomeIcon icon={faBolt} />
                        </div>
                        <div className="stat-info">
                            <h3>Fast</h3>
                            <p>Delivery</p>
                        </div>
                    </div>
                </div>

                {/* LATEST BOOKING & ORDER */}
                <div className="latest-section">
                    <div className="row">
                        {/* Latest Booking */}
                        <div className="col-lg-6 mb-4">
                            <div className="latest-card">
                                <div className="card-header">
                                    <FontAwesomeIcon icon={faCalendarCheck} />
                                    <h3>Latest Service Booking</h3>
                                </div>
                                {latestBooking ? (
                                    <div className="card-content">
                                        <div className="info-row">
                                            <span className="label">Bike:</span>
                                            <span className="value">{latestBooking.bikeCompany} {latestBooking.bikeModel}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Service:</span>
                                            <span className="value">{latestBooking.bikeService}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Price:</span>
                                            <span className="value">₹{latestBooking.price}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Date:</span>
                                            <span className="value">{new Date(latestBooking.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Status:</span>
                                            <span 
                                                className="status-badge" 
                                                style={{ backgroundColor: getStatusColor(latestBooking.status) }}
                                            >
                                                {latestBooking.status}
                                            </span>
                                        </div>
                                        <button className="view-btn" onClick={() => navigate('/tracking')}>
                                            View Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No bookings yet</p>
                                        <button className="book-now-btn" onClick={() => navigate('/serviceselection')}>
                                            Book Service Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Latest Order */}
                        <div className="col-lg-6 mb-4">
                            <div className="latest-card">
                                <div className="card-header">
                                    <FontAwesomeIcon icon={faShoppingBag} />
                                    <h3>Latest Product Order</h3>
                                </div>
                                {latestOrder ? (
                                    <div className="card-content">
                                        <div className="info-row">
                                            <span className="label">Order ID:</span>
                                            <span className="value">#{latestOrder._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Items:</span>
                                            <span className="value">{latestOrder.items.length} item(s)</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Total:</span>
                                            <span className="value">₹{latestOrder.totalAmount}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Payment:</span>
                                            <span className="value">{latestOrder.paymentMethod}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="label">Status:</span>
                                            <span 
                                                className="status-badge" 
                                                style={{ backgroundColor: getStatusColor(latestOrder.orderStatus || latestOrder.status) }}
                                            >
                                                {latestOrder.orderStatus || latestOrder.status}
                                            </span>
                                        </div>
                                        <button className="view-btn" onClick={() => navigate('/my-orders')}>
                                            View Details
                                        </button>
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>No orders yet</p>
                                        <button className="book-now-btn" onClick={() => navigate('/store')}>
                                            Shop Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEATURES */}
                <div className="features-section">
                    <h2 className="section-title">Why Choose Us</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <FontAwesomeIcon icon={faBolt} />
                            </div>
                            <h4>Instant Booking</h4>
                            <p>Book services online without waiting in queues</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FontAwesomeIcon icon={faTools} />
                            </div>
                            <h4>Expert Mechanics</h4>
                            <p>Trained professionals for quality service</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FontAwesomeIcon icon={faMotorcycle} />
                            </div>
                            <h4>Service Tracking</h4>
                            <p>Track your service progress in real-time</p>
                        </div>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="quick-actions">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="actions-grid">
                        <button className="action-card" onClick={() => navigate('/serviceselection')}>
                            <FontAwesomeIcon icon={faMotorcycle} />
                            <span>Book Service</span>
                        </button>

                        <button className="action-card" onClick={() => navigate('/store')}>
                            <FontAwesomeIcon icon={faStore} />
                            <span>Shop Products</span>
                        </button>

                        <button className="action-card" onClick={() => navigate('/history')}>
                            <FontAwesomeIcon icon={faHistory} />
                            <span>View History</span>
                        </button>

                        <button className="action-card" onClick={() => navigate('/profile')}>
                            <FontAwesomeIcon icon={faUser} />
                            <span>My Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default UserHome;