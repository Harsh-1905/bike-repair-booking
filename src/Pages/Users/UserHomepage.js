import React, { useEffect, useState } from "react";
import api from "../../Api/axios";
import "./user-home.css";

const UserHome = () => {

    const [latestBooking, setLatestBooking] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {

        if (!user) return;

        api.get(`/booking/user/${user._id}`)
            .then(res => {

                if (res.data.success) {

                    const bookings = res.data.data;

                    setTotalBookings(bookings.length);

                    if (bookings.length > 0) {
                        setLatestBooking(bookings[0]);
                    }

                }

            })
            .catch(err => console.error(err));

    }, []);

    return (

        <div className="user-home">

            {/* HERO SECTION */}

            <div className="hero-dashboard">

                <div className="container text-center">

                    <h1>Welcome back, {user?.firstName} 👋</h1>

                    <p>
                        Manage your bike services, track your bookings, and keep
                        your ride performing at its best.
                    </p>

                </div>

            </div>


            <div className="container">

                {/* DASHBOARD STATS */}

                <div className="row stats-row">

                    <div className="col-md-4">

                        <div className="stat-card">

                            <h3>{totalBookings}</h3>

                            <p>Total Bookings</p>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="stat-card">

                            <h3>24/7</h3>

                            <p>Support Available</p>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="stat-card">

                            <h3>Fast</h3>

                            <p>Service Turnaround</p>

                        </div>

                    </div>

                </div>


                {/* FEATURE SECTION */}

                <div className="row feature-row text-center">

                    <h2 className="section-title">Our Platform Advantages</h2>

                    <div className="col-md-4">

                        <div className="feature-card">

                            <h4>Instant Booking</h4>

                            <p>
                                Quickly book bike services online without waiting
                                in long queues.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="feature-card">

                            <h4>Expert Mechanics</h4>

                            <p>
                                Highly trained professionals take care of your bike
                                with precision.
                            </p>

                        </div>

                    </div>

                    <div className="col-md-4">

                        <div className="feature-card">

                            <h4>Service Tracking</h4>

                            <p>
                                Track the progress of your repair and view complete
                                booking history anytime.
                            </p>

                        </div>

                    </div>

                </div>


                {/* LATEST BOOKING */}

                <div className="latest-booking-section">

                    <h2 className="section-title">Your Latest Booking</h2>

                    {latestBooking ? (

                        <div className="booking-card">

                            <div className="row">

                                <div className="col-md-6">

                                    <p><strong>Bike:</strong> {latestBooking.bikeCompany} {latestBooking.bikeModel}</p>

                                    <p><strong>Service:</strong> {latestBooking.bikeService}</p>

                                </div>

                                <div className="col-md-6">

                                    <p><strong>Price:</strong> ₹{latestBooking.price}</p>

                                    <p><strong>Date:</strong> {new Date(latestBooking.date).toLocaleDateString()}</p>

                                    <p>
                                        <strong>Status:</strong>
                                        <span className="status-badge">
                                            {latestBooking.status}
                                        </span>
                                    </p>

                                </div>

                            </div>

                        </div>

                    ) : (

                        <div className="alert alert-info">
                            You haven't booked any service yet.
                        </div>

                    )}

                </div>


                {/* QUICK ACTIONS */}

                <div className="row action-row text-center">

                    <h2 className="section-title">Quick Actions</h2>

                    <div className="col-md-4">

                        <a href="/serviceselection" className="action-btn red">
                            Book Service
                        </a>

                    </div>

                    <div className="col-md-4">

                        <a href="/history" className="action-btn dark">
                            Booking History
                        </a>

                    </div>

                    <div className="col-md-4">

                        <a href="/profile" className="action-btn gray">
                            Profile
                        </a>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default UserHome;