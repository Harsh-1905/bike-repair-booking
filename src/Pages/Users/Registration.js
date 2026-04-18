import { useState, useEffect } from "react";
import api from "../../Api/axios";
import { useNavigate, Link } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";

const Registration = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [contactNumberError, setContactNumberError] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const clearData = () => {
        setFullName("");
        setContactNumber("");
        setContactNumberError("");
        setAddress("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleContactNumberChange = (e) => {
        const value = e.target.value;
        
        // Allow only digits
        const numericValue = value.replace(/\D/g, '');
        
        // Limit to 11 digits maximum
        const limitedValue = numericValue.slice(0, 11);
        
        setContactNumber(limitedValue);
        
        // Validate phone number
        if (limitedValue.length === 0) {
            setContactNumberError("");
        } else if (limitedValue.length < 10) {
            setContactNumberError("Phone number must be at least 10 digits");
        } else if (limitedValue.length > 11) {
            setContactNumberError("Phone number cannot exceed 11 digits");
        } else {
            setContactNumberError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fullName || !contactNumber || !address || !email || !password || !confirmPassword) {
            showError("Please fill all required fields");
            return;
        }

        // Validate phone number
        if (contactNumber.length < 10 || contactNumber.length > 11) {
            showError("Phone number must be between 10-11 digits");
            return;
        }

        // Additional phone number format validation
        if (!/^\d{10,11}$/.test(contactNumber)) {
            showError("Phone number must contain only digits");
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
                padding: "3rem",
                borderRadius: "20px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                width: "100%",
                maxWidth: "700px",
                minHeight: "580px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333", fontSize: "2rem", fontWeight: "700" }}>
                    Create Account
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem", fontSize: "1rem" }}>
                    Register to continue to BikeCare
                </p>
                
                <form onSubmit={handleSubmit}>
                    {/* First Row - Full Name and Mobile Number */}
                    <div style={{ 
                        display: "flex", 
                        gap: "1.5rem", 
                        marginBottom: "1.5rem",
                        flexDirection: isMobile ? "column" : "row"
                    }}>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                        </div>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                value={contactNumber}
                                onChange={handleContactNumberChange}
                                placeholder="10-11 digit number"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: `2px solid ${contactNumberError ? '#dc3545' : '#ddd'}`,
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                            {contactNumberError && (
                                <small style={{ 
                                    color: "#dc3545", 
                                    fontSize: "0.8rem", 
                                    marginTop: "0.3rem", 
                                    display: "block" 
                                }}>
                                    {contactNumberError}
                                </small>
                            )}
                        </div>
                    </div>

                    {/* Second Row - Email and Address */}
                    <div style={{ 
                        display: "flex", 
                        gap: "1.5rem", 
                        marginBottom: "1.5rem",
                        flexDirection: isMobile ? "column" : "row"
                    }}>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                        </div>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Address *
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your address"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* Third Row - Password and Confirm Password */}
                    <div style={{ 
                        display: "flex", 
                        gap: "1.5rem", 
                        marginBottom: "2rem",
                        flexDirection: isMobile ? "column" : "row"
                    }}>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Password *
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength="6"
                                placeholder="Min 6 characters"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                        </div>
                        <div style={{ flex: "1" }}>
                            <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem", color: "#333" }}>
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease"
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "linear-gradient(45deg, #f97673, #E43636)",
                            color: "white",
                            border: "none",
                            borderRadius: "25px",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(233, 54, 54, 0.3)"
                        }}
                    >
                        Register
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "1rem" }}>
                    Already have an account? <Link to="/signin" style={{ color: "#E43636", textDecoration: "none", fontWeight: "600" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Registration;
