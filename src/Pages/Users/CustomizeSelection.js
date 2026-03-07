import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./customize-selection.css";

function CustomizeSelection() {

    const navigate = useNavigate();

    const [services, setServices] = useState([
        { name: "Engine Oil Change", price: 300, selected: false },
        { name: "Brake Inspection", price: 150, selected: false },
        { name: "Chain Lubrication", price: 100, selected: false },
        { name: "Battery Check", price: 120, selected: false },
        { name: "Air Filter Cleaning", price: 130, selected: false },
        { name: "Tyre Pressure Check", price: 80, selected: false },
        { name: "Clutch Adjustment", price: 160, selected: false },
        { name: "Coolant Check", price: 140, selected: false },
        { name: "Spark Plug Cleaning", price: 120, selected: false },
        { name: "Headlight Check", price: 90, selected: false },
        { name: "Horn Check", price: 60, selected: false },
        { name: "Gear Oil Check", price: 110, selected: false },
        { name: "Brake Fluid Check", price: 130, selected: false },
        { name: "Wheel Alignment", price: 200, selected: false },
        { name: "Full Safety Inspection", price: 250, selected: false }
    ]);

    const [totalPrice, setTotalPrice] = useState(0);

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
            .map(s => s.name);

        navigate(`/booking?service=Customize Service&price=${totalPrice}&services=${encodeURIComponent(JSON.stringify(selectedServices))}`);
    };

    return (
        <div className="custom-bg">

            <div className="container customize-container">

                <h2 className="text-center title">Customize Your Service</h2>

                <p className="text-center subtitle">
                    Select the services you want. Total price will update automatically.
                </p>

                <div className="service-box">

                    {services.map((service, index) => (

                        <div key={index} className="service-item">

                            <div className="checkbox-col">

                                <input
                                    type="checkbox"
                                    checked={service.selected}
                                    onChange={() => toggleService(index)}
                                />

                            </div>

                            <div className="service-name">
                                {service.name}
                            </div>

                            <div className="service-price">
                                ₹{service.price}
                            </div>

                        </div>

                    ))}

                </div>

                <div className="action-buttons">

                    <button className="clear-btn" onClick={clearSelections}>
                        Cancel All Selection
                    </button>

                </div>

                <div className="total-box">

                    <h3>Total Price</h3>

                    <div className="total-price">
                        ₹{totalPrice}
                    </div>

                </div>

                <button className="book-btn" onClick={bookCustomService}>
                    Book Customized Service
                </button>

            </div>

        </div>
    );
}

export default CustomizeSelection;