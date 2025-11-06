import api from '../Api/axios';
import { showError, showSuccess } from "../utils/toast";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Booking = () => {
    const [bikename, setBikeName] = useState("");
    const [bikeCompany, setBikeCompany] = useState("");
    const [bikeModel, setBikeModel] = useState("");
    const [bikeType, setBikeType] = useState("");
    const [bikeNumPlate, setBikeNumPlate] = useState("");
    const [bikeServices, setBikeServices] = useState("");
    const [date, setDate] = useState("");
    const [remarks, setRemarks] = useState("");

    const navigate = useNavigate();

    const handleButtonClick = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            showError("Please login first!");
            navigate("/signin");
            return;
        }

        const bookingData = {
            user_id: user._id,   // MongoDB _id
            bike_services: bikeServices,
            bike_name: bikename,
            bike_company: bikeCompany,
            bike_model: bikeModel,
            bike_type: bikeType,
            bike_numplate: bikeNumPlate,
            date_time: date,
            remarks,
        };

        // Validation (skip user_id)
        for (let [key, value] of Object.entries(bookingData)) {
            if (key !== "user_id" && !value) {
                showError(`Please fill the ${key}`);
                return;
            }
        }

        api.post("/booking", bookingData)
            .then((res) => {
                if (res.data.success) {
                    showSuccess(res.data.message || "Booking successful!");
                    clearData();
                    window.location.href = "/service"; // redirect after success
                } else {
                    showError(res.data.message || "Something went wrong");
                }
            })
            .catch((err) => {
                showError("Server error: " + (err.response?.data?.message || err.message));
            });
    };

    const clearData = () => {
        setBikeName("");
        setBikeCompany("");
        setBikeModel("");
        setBikeType("");
        setBikeNumPlate("");
        setBikeServices("");
        setDate("");
        setRemarks("");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="col-12 col-md-6 col-lg-7 border shadow-lg rounded p-4" style={{ paddingTop: '110px' }}>
                <h3 className="text-center mb-4">BOOK YOUR SERVICES</h3>
                <div className="d-flex flex-column gap-3 w-100">

                    <input type="text" className="form-control" value={bikename} placeholder="Bike Name" onChange={(e) => setBikeName(e.target.value)} />

                    <input type="text" className="form-control" value={bikeCompany} placeholder="Bike Company" onChange={(e) => setBikeCompany(e.target.value)} />

                    <input type="text" className="form-control" value={bikeModel} placeholder="Bike Model" onChange={(e) => setBikeModel(e.target.value)} />

                    <select className="form-select" value={bikeType} onChange={(e) => setBikeType(e.target.value)}>
                        <option value="">Bike Type</option>
                        <option value="Bike">Bike</option>
                        <option value="Moped">Moped</option>
                    </select>

                    <input type="text" className="form-control" value={bikeNumPlate} placeholder="Number Plate" onChange={(e) => setBikeNumPlate(e.target.value)} />

                    <select className="form-select" value={bikeServices} onChange={(e) => setBikeServices(e.target.value)}>
                        <option value="">Select The Service</option>
                        <option value="1">General Service</option>
                        <option value="2">On Road Service</option>
                        <option value="3">All-Over Service</option>
                    </select>

                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Select Date</label>
                        <input type="date" className="form-control" value={date} id="date" onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <textarea className="form-control" value={remarks} placeholder="Remarks" onChange={(e) => setRemarks(e.target.value)} />

                    <button className="btn mt-3" onClick={handleButtonClick} style={{ background: '#E43636', color: '#FFF', width: '100%' }}>
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
