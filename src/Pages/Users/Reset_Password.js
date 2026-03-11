import { useState } from "react";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Reset_Password = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // Email passed from ForgotPassword page
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            showError("Please fill all fields");
            return;
        }

        if (newPassword.length < 6) {
            showError("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        try {
            const res = await api.post("/resetpassword", {
                email,
                otp,
                newPassword,
            });

            if (res.data.success) {
                showSuccess(res.data.message || "Password reset successful");
                navigate("/signin");
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
                    Reset Password
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
                    Enter the OTP sent to your email and create a new password
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            OTP *
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
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
                            New Password *
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength="6"
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
                        Reset Password
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                    Remember your password? <Link to="/signin" style={{ color: "#E43636", textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Reset_Password;
