import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./user-booking.css";
import ServiceBill from "./ServiceBill";

// Bike data organized by company and type
const bikeData = {
    "Hero MotoCorp": {
        bikes: ["Hero Splendor Plus", "Hero HF Deluxe", "Hero Glamour", "Hero Passion Plus", "Hero Xtreme 160R"],
        scooters: ["Hero Pleasure+", "Hero Maestro Edge 125", "Hero Destini 125", "Hero Xoom 110", "Hero Duet"]
    },
    "Honda": {
        bikes: ["Honda Shine", "Honda SP125", "Honda Unicorn", "Honda Hornet 2.0", "Honda CB350"],
        scooters: ["Honda Activa", "Honda Activa 125", "Honda Dio", "Honda Grazia", "Honda Aviator"]
    },
    "Bajaj": {
        bikes: ["Bajaj Pulsar 125", "Bajaj Pulsar 150", "Bajaj Pulsar NS200", "Bajaj Platina 110", "Bajaj Dominar 400"],
        scooters: ["Bajaj Chetak (Electric)", "Bajaj Chetak Classic", "Bajaj Chetak Premium", "Bajaj Chetak Urbane", "Bajaj Crystal"]
    },
    "TVS": {
        bikes: ["TVS Raider 125", "TVS Apache RTR 160", "TVS Apache RTR 200", "TVS Sport", "TVS Star City Plus"],
        scooters: ["TVS Jupiter", "TVS Ntorq 125", "TVS Scooty Pep+", "TVS Zest 110", "TVS XL100"]
    },
    "Suzuki": {
        bikes: ["Suzuki Gixxer", "Suzuki Gixxer SF", "Suzuki V-Strom SX", "Suzuki Intruder", "Suzuki Hayabusa"],
        scooters: ["Suzuki Access 125", "Suzuki Burgman Street", "Suzuki Avenis", "Suzuki Swish", "Suzuki Let's"]
    }
};

function UserBooking() {

    const location = useLocation();
    const navigate = useNavigate();

    const [bikeCompany, setBikeCompany] = useState("");
    const [bikeModel, setBikeModel] = useState("");
    const [bikeType, setBikeType] = useState("");
    const [bikeNumPlate, setBikeNumPlate] = useState("");
    const [bikeService, setBikeService] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [date, setDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [pickupDrop, setPickupDrop] = useState("no");
    const [minDate, setMinDate] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [availableModels, setAvailableModels] = useState([]);
    const [showManualCompany, setShowManualCompany] = useState(false);
    const [showManualModel, setShowManualModel] = useState(false);
    const [manualCompany, setManualCompany] = useState("");
    const [manualModel, setManualModel] = useState("");

    const bikeTypes = ["Bike", "Moped"];
    const companies = Object.keys(bikeData);

    const pickupOptions = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
    ];

    // Update available models when company or bike type changes
    useEffect(() => {
        if (bikeCompany && bikeType && bikeCompany !== "Other") {
            const type = bikeType.toLowerCase() === "bike" ? "bikes" : "scooters";
            setAvailableModels(bikeData[bikeCompany]?.[type] || []);
            setBikeModel(""); // Reset model when company or type changes
            setShowManualModel(false);
        } else {
            setAvailableModels([]);
            setBikeModel("");
        }
    }, [bikeCompany, bikeType]);

    useEffect(() => {

        const today = new Date();
        setMinDate(today.toISOString().split("T")[0]);

        const params = new URLSearchParams(location.search);

        const service = params.get("service");
        const price = params.get("price");
        const services = params.get("services"); // NEW

        if (service) {

            setBikeService(service);

            if (service === "All-Over Service") {
                setServicePrice(999);
            }

            if (service === "General Service") {
                setServicePrice(499);
            }

            if (service === "Customize Service") {

                setServicePrice(Number(price) || 0);

                if (services) {
                    const parsedServices = JSON.parse(decodeURIComponent(services));
                    setSelectedServices(parsedServices);
                }

            }
        }

    }, [location]);

    const proceedToBilling = async () => {

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            alert("You cannot select a past date");
            return;
        }
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first");
            return;
        }

        // Determine final company and model values
        const finalCompany = bikeCompany === "Other" ? manualCompany : bikeCompany;
        const finalModel = bikeModel === "Other" ? manualModel : bikeModel;

        if (!finalCompany) {
            alert("Please enter bike company");
            return;
        }

        if (!finalModel) {
            alert("Please enter bike model");
            return;
        }

        if (!bikeNumPlate) {
            alert("Please enter bike number plate");
            return;
        }

        if (!date) {
            alert("Please select service date");
            return;
        }

        const bookingData = {
            user_id: user._id,
            bikeCompany: finalCompany,
            bikeModel: finalModel,
            bikeType,
            bikeNumPlate,
            bikeService,
            selectedServices,
            price: servicePrice,
            date,
            remarks,
            pickupDrop
        };

        // Navigate to billing page with booking data
        navigate("/service-billing", { state: { bookingData } });
    };

    return (
        <section className="booking-section d-flex align-items-center">
            <div className="container">

                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">

                        <div className="booking-card p-4 p-md-5 rounded shadow-lg">

                            <h3 className="text-center mb-1">Book Your Service</h3>
                            <p className="text-center text-muted mb-4">
                                Fill the details to continue
                            </p>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={bikeType}
                                        onChange={(e) => setBikeType(e.target.value)}
                                    >
                                        <option value="">Select Bike Type</option>
                                        {bikeTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={bikeCompany}
                                        onChange={(e) => {
                                            setBikeCompany(e.target.value);
                                            setShowManualCompany(e.target.value === "Other");
                                            if (e.target.value !== "Other") {
                                                setManualCompany("");
                                            }
                                        }}
                                        disabled={!bikeType}
                                    >
                                        <option value="">Select Bike Company</option>
                                        {companies.map((company, index) => (
                                            <option key={index} value={company}>
                                                {company}
                                            </option>
                                        ))}
                                        <option value="Other">Other (Specify)</option>
                                    </select>
                                </div>

                                {showManualCompany && (
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Bike Company"
                                            value={manualCompany}
                                            onChange={(e) => setManualCompany(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={bikeModel}
                                        onChange={(e) => {
                                            setBikeModel(e.target.value);
                                            setShowManualModel(e.target.value === "Other");
                                            if (e.target.value !== "Other") {
                                                setManualModel("");
                                            }
                                        }}
                                        disabled={!bikeCompany || !bikeType || (bikeCompany === "Other" && !manualCompany)}
                                    >
                                        <option value="">Select Bike Model</option>
                                        {availableModels.map((model, index) => (
                                            <option key={index} value={model}>
                                                {model}
                                            </option>
                                        ))}
                                        <option value="Other">Other (Specify)</option>
                                    </select>
                                </div>

                                {showManualModel && (
                                    <div className="col-md-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Bike Model"
                                            value={manualModel}
                                            onChange={(e) => setManualModel(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Number Plate (e.g., GJ01AB1234)"
                                        value={bikeNumPlate}
                                        onChange={(e) => setBikeNumPlate(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Selected Service</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={bikeService}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Service Price</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        value={`₹${servicePrice}`}
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Service Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={date}
                                        min={minDate}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Pickup & Drop</label>

                                    <div className="d-flex gap-4">

                                        {pickupOptions.map((option, index) => (

                                            <div className="form-check" key={index}>

                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="pickupDrop"
                                                    value={option.value}
                                                    checked={pickupDrop === option.value}
                                                    onChange={(e) => setPickupDrop(e.target.value)}
                                                />

                                                <label className="form-check-label">
                                                    {option.label}
                                                </label>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                {pickupDrop === "yes" && (

                                    <div className="col-12">
                                        <input
                                            className="form-control"
                                            placeholder="Pickup Address"
                                        />
                                    </div>

                                )}

                                <div className="col-12">

                                    <textarea
                                        className="form-control"
                                        placeholder="Remarks"
                                        rows="3"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />

                                </div>
                                <div className="col-12">

                                    <ServiceBill
                                        serviceType={bikeService}
                                        selectedServices={selectedServices}
                                        pickupDrop={pickupDrop}
                                    />

                                </div>

                                <div className="col-12">

                                    <button
                                        className="btn btn-warning w-100 py-2"
                                        onClick={proceedToBilling}
                                    >
                                        Proceed to Payment
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default UserBooking;