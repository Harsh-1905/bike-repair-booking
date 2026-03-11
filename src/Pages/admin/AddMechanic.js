import React, { useState } from "react";
import api from "../../Api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "./add-mechanic.css";

const AddMechanic = ({ isCollapsed }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phone: "",
        email: "",
        yearsOfExperience: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/mechanics", formData);
            showSuccess("Mechanic added successfully!");

            // Reset form
            setFormData({
                fullName: "",
                address: "",
                phone: "",
                email: "",
                yearsOfExperience: "",
            });
        } catch (error) {
            console.error("Error adding mechanic:", error);
            showError(error.response?.data?.message || "Failed to add mechanic");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="add-mechanic-container"
            style={{
                marginLeft: isCollapsed ? "80px" : "250px",
                transition: "margin-left 0.3s ease"
            }}
        >
            <div className="add-mechanic-header">
                <h2>
                    <FontAwesomeIcon icon={faUserPlus} /> Add New Mechanic
                </h2>
            </div>

            <div className="add-mechanic-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Years of Experience *</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleChange}
                                placeholder="Enter years of experience"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address *</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            rows="3"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Adding Mechanic..." : "Add Mechanic"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMechanic;
