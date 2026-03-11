import React from "react";
import { useNavigate } from "react-router-dom";
import "./service-selection.css";

function ServiceSelection() {

    const navigate = useNavigate();

    const bookService = (service, price) => {
        navigate(`/booking?service=${service}&price=${price}`);
    };

    return (
        <div className="service-page-bg">
            <div className="container service-container">

                <h2 className="text-center section-title">Choose Your Service</h2>

                {/* All Over Service */}
                <div className="service-card premium-service">

                    <div className="service-header">
                        <h3>All Over Service</h3>
                        <div className="price">₹999</div>
                    </div>

                    <ul className="service-list">
                        <li>Engine oil change</li>
                        <li>Brake inspection</li>
                        <li>Chain lubrication</li>
                        <li>Battery check</li>
                        <li>Air filter cleaning</li>
                        <li>Full bike inspection</li>
                    </ul>

                    <button
                        className="book-btn"
                        onClick={() => bookService("All-Over Service", 999)}
                    >
                        Book Now
                    </button>

                </div>

                {/* General Service */}
                <div className="service-card basic-service">

                    <div className="service-header">
                        <h3>General Service</h3>
                        <div className="price">₹499</div>
                    </div>

                    <ul className="service-list">
                        <li>Oil check</li>
                        <li>Brake adjustment</li>
                        <li>Chain tightening</li>
                        <li>Tyre pressure check</li>
                        <li>Basic inspection</li>
                    </ul>

                    <button
                        className="book-btn"
                        onClick={() => bookService("General Service", 499)}
                    >
                        Book Now
                    </button>

                </div>

                {/* Customize Service */}
                <div className="service-card customize-service">

                    <div className="service-header">
                        <h3>Customize Service</h3>
                        <div className="price">Custom</div>
                    </div>

                    <p className="custom-desc">
                        Choose only the services your bike needs. Select multiple options
                        and the total price will be calculated automatically.
                    </p>

                    <ul className="service-list">
                        <li>Select individual services</li>
                        <li>Flexible pricing</li>
                        <li>Pay only for what you choose</li>
                        <li>Best for minor issues</li>
                    </ul>

                    <button
                        className="book-btn customize-btn"
                        onClick={() => navigate("/customselection", { replace: false })}
                    >
                        Customize Now
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ServiceSelection;