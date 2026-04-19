import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/axios";
import "./customize-selection.css";

function CustomizeSelection() {

    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get("/services/custom");
            if (response.data.success) {
                const servicesWithSelection = response.data.services.map(service => ({
                    ...service,
                    selected: false
                }));
                setServices(servicesWithSelection);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            // Fallback to default services if API fails
            setServices([
                { _id: "1", name: "Engine Oil Change", price: 300, selected: false },
                { _id: "2", name: "Brake Inspection", price: 150, selected: false },
                { _id: "3", name: "Chain Lubrication", price: 100, selected: false },
                { _id: "4", name: "Battery Check", price: 120, selected: false },
                { _id: "5", name: "Air Filter Cleaning", price: 130, selected: false },
                { _id: "6", name: "Tyre Pressure Check", price: 80, selected: false },
                { _id: "7", name: "Clutch Adjustment", price: 160, selected: false },
                { _id: "8", name: "Coolant Check", price: 140, selected: false },
                { _id: "9", name: "Spark Plug Cleaning", price: 120, selected: false },
                { _id: "10", name: "Headlight Check", price: 90, selected: false },
                { _id: "11", name: "Horn Check", price: 60, selected: false },
                { _id: "12", name: "Gear Oil Check", price: 110, selected: false },
                { _id: "13", name: "Brake Fluid Check", price: 130, selected: false },
                { _id: "14", name: "Wheel Alignment", price: 200, selected: false },
                { _id: "15", name: "Full Safety Inspection", price: 250, selected: false }
            ]);
        }
        setLoading(false);
    };

    const toggleService = (index) => {

        const updated = [...services];
        updated[index].selected = !updated[index].selected;

        setServices(updated);

        const total = updated
            .filter(s => s.selected)
            .reduce((sum, s) => sum + s.price, 0);

        setTotalPrice(total);
    };

    const clearSelections = () => {

        const cleared = services.map(s => ({
            ...s,
            selected: false
        }));

        setServices(cleared);
        setTotalPrice(0);
    };

    const bookCustomService = () => {

        if (totalPrice === 0) {
            alert("Please select at least one service");
            return;
        }

        const selectedServices = services
            .filter(s => s.selected)
            .map(s => ({ name: s.name, price: s.price }));

        navigate(`/booking?service=Customize Service&price=${totalPrice}&services=${encodeURIComponent(JSON.stringify(selectedServices))}`);
    };

    const selectedCount = services.filter(s => s.selected).length;

    if (loading) {
        return (
            <div className="custom-bg">
                <div className="container customize-container">
                    <div className="loading-state">
                        <h2>Loading Services...</h2>
                        <p>Please wait while we fetch the available services.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="custom-bg">

            <div className="container customize-container">

                <h2 className="title">Customize Your Service</h2>

                <p className="subtitle">
                    Select the services you want. Total price will update automatically.
                </p>

                <div className="customize-layout">
                    
                    <div className="service-box">
                        <div className="services-grid">
                            {services.map((service, index) => (

                                <div 
                                    key={service._id || index} 
                                    className={`service-item ${service.selected ? 'selected' : ''}`}
                                    onClick={() => toggleService(index)}
                                >

                                    <div className="service-name">
                                        {service.name}
                                    </div>

                                    <div className="service-price">
                                        ₹{service.price}
                                    </div>

                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="customize-sidebar">
                        
                        <div className="action-buttons">
                            <button className="clear-btn" onClick={clearSelections}>
                                Clear All Selections
                            </button>
                        </div>

                        <div className="total-box">

                            <h3>Order Summary</h3>

                            <div className="total-price">
                                ₹{totalPrice}
                            </div>
                            
                            <div className="selected-count">
                                {selectedCount} service{selectedCount !== 1 ? 's' : ''} selected
                            </div>

                        </div>

                        <button 
                            className="book-btn" 
                            onClick={bookCustomService}
                            disabled={totalPrice === 0}
                        >
                            Book Customized Service
                        </button>
                        
                    </div>
                    
                </div>

            </div>

        </div>
    );
}

export default CustomizeSelection;