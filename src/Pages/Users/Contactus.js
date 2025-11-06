import { useState } from "react";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const clearData = () => {
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validations
        const { firstName, lastName, email, message } = formData;

        if (!firstName || !lastName || !email || !message) {
            showError("Please fill all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const res = await api.post("/contact", {
                name: `${firstName} ${lastName}`,
                email,
                subject: "Contact Form Inquiry",
                message
            });

            if (res.data.success) {
                showSuccess(res.data.message || "Message sent successfully!");
                clearData();
            } else {
                showError(res.data.message || "Failed to submit message");
            }
        } catch (err) {
            showError("Server error: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <>
            <div className="container my-5">
                <div className="row align-items-start">
                    <div className="col-md-6">
                        <h2 className="fw-bold mb-3">Contact us</h2>
                        <p className="text-muted mb-4">
                            Need to get in touch with us? Fill out the form below.
                        </p>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow-sm p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name*"
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name*"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email*"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message*"
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn w-full" style={{ background: "#E43636", color: "#FFF", width: "250px" }}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Info Boxes */}
                <div className="row text-center mt-5">
                    <div className="col-md-4 mb-3 d-flex">
                        <div className="border border-danger rounded-3 p-4 shadow-sm w-100 h-100">
                            <h5 className="fw-bold">Address</h5>
                            <p className="text-muted mb-0">Bardoli-Isroli Road, Gujarat, India</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 d-flex">
                        <div className="border border-danger rounded-3 p-4 shadow-sm w-100 h-100">
                            <h5 className="fw-bold">Contact Info</h5>
                            <p className="text-muted mb-1">99252 99383</p>
                            <p className="text-muted mb-0">76228 99383</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 d-flex">
                        <div className="border border-danger rounded-3 p-4 shadow-sm w-100 h-100">
                            <h5 className="fw-bold">Email</h5>
                            <p className="text-muted mb-0">bikecare@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <footer className="text-center py-3 w-100" style={{ backgroundColor: "#000", color: "#FFF" }}>
                <p className="mb-0">&copy; 2025 BikeCare. All Rights Reserved.</p>
            </footer>
        </>
    );
};

export default ContactUs;
