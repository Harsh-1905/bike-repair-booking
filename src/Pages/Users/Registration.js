import { useState } from "react";
import api from "../../Api/axios";
import { useNavigate, Link } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";

const Registration = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const clearData = () => {
        setFullName("");
        setContactNumber("");
        setAddress("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fullName || !contactNumber || !address || !email || !password || !confirmPassword) {
            showError("Please fill all required fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            showError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        const allowedAddresses = ["bardoli", "surat", "navsari", "vyara"];
        if (!allowedAddresses.includes(address.trim().toLowerCase())) {
            showError("We are currently operating only in Bardoli, Surat, Navsari, Vyara");
            return;
        }

        const userData = {
            fullName,
            contactNumber,
            address,
            email,
            password,
            userType: "user",
            isActive: true
        };

        api.post("/user", userData)
            .then((res) => {
                if (res.data.success) {
                    showSuccess(res.data.message);
                    clearData();
                    navigate("/signin");
                } else {
                    showError(res.data.message);
                }
            })
            .catch((err) => {
                console.error("Registration error:", err);
                console.error("Error response:", err.response?.data);
                showError("Server error: " + (err.response?.data?.message || err.message));
            });
    };

    return (
        <div style={{ 
            minHeight: "100vh", 
            background: "linear-gradient(135deg, #fff8e1, #ffd6cc, #f97673)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "15px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "500px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
                    Create Account
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
                    Register to continue to BikeCare
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Mobile Number *
                        </label>
                        <input
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            maxLength="10"
                            placeholder="Enter 10-digit mobile number"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Address *
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Bardoli, Surat, Navsari, or Vyara"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="6"
                            placeholder="Minimum 6 characters"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                fontSize: "1rem"
                            }}
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "linear-gradient(45deg, #f97673, #E43636)",
                            color: "white",
                            border: "none",
                            borderRadius: "25px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                        }}
                    >
                        Register
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                    Already have an account? <Link to="/signin" style={{ color: "#E43636", textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Registration;
