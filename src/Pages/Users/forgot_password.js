import { useState } from "react";
import api from '../../Api/axios';
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, Link } from 'react-router-dom';

const Forgot_Password = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            showError("Please enter your email address");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const res = await api.post("/forgotpassword", { email });

            if (res.data.success) {
                showSuccess(res.data.message || "OTP sent successfully");
                navigate("/resetpassword", {
                    state: { email }
                });
            } else {
                showError(res.data.message || "Something went wrong");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Server error");
        }
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
                maxWidth: "400px"
            }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
                    Forgot Password
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
                    Enter your email address and we'll send you an OTP to reset your password
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
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
                        Send OTP
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                    Remember your password? <Link to="/signin" style={{ color: "#E43636", textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Forgot_Password;
