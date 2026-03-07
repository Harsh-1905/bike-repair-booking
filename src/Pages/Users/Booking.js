import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./user-booking.css";

function UserBooking() {

    const location = useLocation();

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

    const bikeTypes = ["Bike", "Moped"];

    const pickupOptions = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
    ];

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

    const bookService = async () => {

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
        const bookingData = {
            user_id: user._id,
            bikeCompany,
            bikeModel,
            bikeType,
            bikeNumPlate,
            bikeService,
            selectedServices,
            price: servicePrice,
            date,
            remarks,
            pickupDrop
        };
        console.log("Booking data:", bookingData);
        try {

            const res = await axios.post(
                "http://localhost:8000/api/booking",
                bookingData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            console.log("Booking success:", res.data);
            alert("Booking successful");

            resetForm();

        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.message || "Booking failed");
        }

    };

    const resetForm = () => {
        setBikeCompany("");
        setBikeModel("");
        setBikeType("");
        setBikeNumPlate("");
        setDate("");
        setPickupDrop("no");
        setRemarks("");
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Bike Company"
                                        value={bikeCompany}
                                        onChange={(e) => setBikeCompany(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Bike Model"
                                        value={bikeModel}
                                        onChange={(e) => setBikeModel(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <select
                                        className="form-select"
                                        value={bikeType}
                                        onChange={(e) => setBikeType(e.target.value)}
                                    >
                                        <option value="">Bike Type</option>

                                        {bikeTypes.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}

                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="GJ01AB1234"
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

                                    <button
                                        className="btn btn-warning w-100 py-2"
                                        onClick={bookService}
                                    >
                                        Book Service
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