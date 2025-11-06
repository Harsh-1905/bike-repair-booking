import { useState } from "react";
import api from "../../Api/axios";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";

const Registration = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleButtonClick = () => {
        const users = {
            firstName,
            middleName,
            lastName,
            contactNumber,
            address,
            email: emailID,
            password,
            userType: "user",
            isActive: true
        };

        // ✅ validations
        for (let [key, value] of Object.entries(users)) {
            if (!value) {
                showError(`Please fill the ${key}`);
                return;
            }
        }
        if (!/^\d{10}$/.test(contactNumber)) {
            showError("Contact number must be 10 digits");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailID)) {
            showError("Please enter a valid email address");
            return;
        }
        if (password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }
        const allowedAddresses = ["bardoli", "surat", "navsari", "vyara"];
        if (!allowedAddresses.includes(address.trim().toLowerCase())) {
            showError("We are currently operating only in Bardoli, Surat, Navsari,Vyara");
            return;
        }

        // ✅ API call
        api.post("/user", users)
            .then((res) => {
                if (res.data.success) {
                    showSuccess(res.data.message);
                    clearData();
                    window.location.href = "/login";
                } else {
                    navigate("/login");
                }
            })
            .catch((err) => {
                showError("Server error: " + (err.response?.data?.message || err.message));
            });
    };

    const clearData = () => {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setContactNumber("");
        setAddress("");
        setEmailID("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleButtonClick(); }}>
            <div className="d-flex flex-column flex-md-row w-100 vh-100">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                    <img
                        src="../images/bikecare7.jpg"
                        alt="Bike"
                        className="img-fluid h-70 w-70 object-fit-cover"
                    />
                </div>

                <div
                    className="col-12 col-md-6 border d-flex flex-column pt-5 gap-4 p-4 align-items-center shadow-lg"
                    style={{ background: "" }}
                >
                    <div>
                        <h3 className="text-center">REGISTRATION FORM</h3>
                    </div>
                    <div className="d-flex flex-column gap-4">
                        <div className="d-flex flex-row gap-4 justify-content-center">
                            <input
                                type="text"
                                className="form-control"
                                value={firstName}
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={middleName}
                                placeholder="Middle Name"
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={lastName}
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className="form-control"
                                value={contactNumber}
                                placeholder="Contact Number"
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>

                        <div>
                            <textarea
                                className="form-control"
                                id="address"
                                rows="3"
                                placeholder="Enter your address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className="form-control"
                                value={emailID}
                                placeholder="Email"
                                onChange={(e) => setEmailID(e.target.value)}
                            />
                        </div>

                        <div className="d-flex flex-row gap-4 justify-content-center">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn w-full"
                            style={{
                                background: "#E43636",
                                color: "#FFF",
                                width: "250px",
                            }}
                        >
                            Sign UP
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Registration;
