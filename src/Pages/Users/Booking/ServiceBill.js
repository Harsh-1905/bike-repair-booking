import React from "react";
import "./bill.css";

function ServiceBill({ serviceType, selectedServices, pickupDrop }) {

    let services = [];

    if (serviceType === "All-Over Service") {
        services = [
            { name: "Engine Oil Change", price: 300 },
            { name: "Brake Inspection", price: 150 },
            { name: "Chain Lubrication", price: 120 },
            { name: "Battery Check", price: 120 },
            { name: "Air Filter Cleaning", price: 150 },
            { name: "Full Bike Inspection", price: 159 }
        ];
    }

    if (serviceType === "General Service") {
        services = [
            { name: "Oil Check", price: 120 },
            { name: "Brake Adjustment", price: 100 },
            { name: "Chain Tightening", price: 90 },
            { name: "Tyre Pressure Check", price: 80 },
            { name: "Basic Inspection", price: 109 }
        ];
    }

    if (serviceType === "Customize Service") {
        // Ensure selectedServices is an array and has the right format
        if (Array.isArray(selectedServices) && selectedServices.length > 0) {
            services = selectedServices.map(service => {
                if (typeof service === 'string') {
                    // If service is just a string, create an object with default price
                    return { name: service, price: 100 };
                }
                return service; // Already an object with name and price
            });
        } else {
            services = [{ name: "Custom Service", price: 0 }];
        }
    }

    let total = services.reduce((sum, item) => sum + item.price, 0);

    if (pickupDrop === "yes") {
        total += 100;
    }

    return (
        <div className="bill-card">

            <h4 className="bill-title">Service Bill</h4>

            <div className="bill-items">
                {services.length > 0 ? (
                    <>
                        {services.map((service, index) => (
                            <div className="bill-row" key={index}>
                                <span>{service.name}</span>
                                <span>₹{service.price}</span>
                            </div>
                        ))}

                        {pickupDrop === "yes" && (
                            <div className="bill-row">
                                <span>Pickup & Drop</span>
                                <span>₹100</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bill-row">
                        <span>No services selected</span>
                        <span>₹0</span>
                    </div>
                )}
            </div>

            <div className="bill-total">
                <span>Total</span>
                <span>₹{total}</span>
            </div>

        </div>
    );
}

export default ServiceBill;