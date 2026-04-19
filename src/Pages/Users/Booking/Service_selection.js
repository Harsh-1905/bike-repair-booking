import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import "./service-selection.css";

function ServiceSelection() {

    const navigate = useNavigate();
    const [packages, setPackages] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/services/packages")
            .then(res => {
                if (res.data.success) {
                    // Map by name for easy lookup
                    const map = {};
                    res.data.packages.forEach(pkg => {
                        map[pkg.name] = pkg;
                    });
                    setPackages(map);
                }
            })
            .catch(err => console.error("Error fetching packages:", err))
            .finally(() => setLoading(false));
    }, []);

    const getPrice = (name) => packages[name]?.price ?? "...";

    const bookService = (service, price) => {
        navigate(`/booking?service=${service}&price=${price}`);
    };

    return (
        <div className="service-page-bg">
            <div className="container service-container">

                <h2 className="section-title">Choose Your Service</h2>

                <div className="services-grid">
                    {/* All Over Service */}
                    <div className="service-card premium-service">

                        <div className="service-header">
                            <h3>All Over Service</h3>
                            <div className="price">{loading ? "..." : `₹${getPrice("All-over Service")}`}</div>
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
                            onClick={() => bookService("All-Over Service", getPrice("All-over Service"))}
                        >
                            Book Now
                        </button>

                    </div>

                    {/* General Service */}
                    <div className="service-card basic-service">

                        <div className="service-header">
                            <h3>General Service</h3>
                            <div className="price">{loading ? "..." : `₹${getPrice("General Service")}`}</div>
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
                            onClick={() => bookService("General Service", getPrice("General Service"))}
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
        </div>
    );
}

export default ServiceSelection;