import { useState } from "react";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Reset_Password = () => {
    const [step, setStep] = useState(1); // 1 = OTP verification, 2 = Password reset
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Email passed from ForgotPassword page
    const email = location.state?.email;

    const handleOtpVerification = async (e) => {
        e.preventDefault();

        if (!otp) {
            showError("Please enter the OTP");
            return;
        }

        if (otp.length !== 6) {
            showError("OTP must be 6 digits");
            return;
        }

        setIsVerifying(true);

        try {
            const res = await api.post("/verify-otp", {
                email,
                otp,
            });

            if (res.data.success) {
                showSuccess("OTP verified successfully! Now set your new password.");
                setStep(2); // Move to password reset step
            } else {
                showError(res.data.message || "Invalid OTP");
            }
        } catch (err) {
            showError(err.response?.data?.message || "OTP verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            showError("Please fill all password fields");
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

        setIsResetting(true);

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
        } finally {
            setIsResetting(false);
        }
    };

    const goBackToOtp = () => {
        setStep(1);
        setNewPassword("");
        setConfirmPassword("");
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
                padding: "2.5rem",
                borderRadius: "15px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "450px",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                {/* Step Indicator */}
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    marginBottom: "2rem",
                    gap: "1rem"
                }}>
                    <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: step >= 1 ? "#E43636" : "#ddd",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                    }}>1</div>
                    <div style={{
                        width: "40px",
                        height: "2px",
                        background: step >= 2 ? "#E43636" : "#ddd",
                        alignSelf: "center"
                    }}></div>
                    <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: step >= 2 ? "#E43636" : "#ddd",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                    }}>2</div>
                </div>

                {step === 1 ? (
                    // Step 1: OTP Verification
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333", fontSize: "1.8rem" }}>
                            Verify OTP
                        </h2>
                        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem", fontSize: "0.95rem" }}>
                            Enter the 6-digit OTP sent to your email
                        </p>
                        
                        <form onSubmit={handleOtpVerification}>
                            <div style={{ marginBottom: "2rem" }}>
                                <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem" }}>
                                    OTP Code *
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength="6"
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        border: "2px solid #ddd",
                                        borderRadius: "10px",
                                        fontSize: "1.2rem",
                                        textAlign: "center",
                                        letterSpacing: "0.5rem",
                                        boxSizing: "border-box"
                                    }}
                                    required
                                />
                                <small style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.5rem", display: "block" }}>
                                    Check your email inbox and spam folder
                                </small>
                            </div>

                            <button 
                                type="submit"
                                disabled={isVerifying}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: isVerifying ? "#ccc" : "linear-gradient(45deg, #f97673, #E43636)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "25px",
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    cursor: isVerifying ? "not-allowed" : "pointer",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    </>
                ) : (
                    // Step 2: Password Reset
                    <>
                        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333", fontSize: "1.8rem" }}>
                            Set New Password
                        </h2>
                        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem", fontSize: "0.95rem" }}>
                            Create a strong password for your account
                        </p>
                        
                        <form onSubmit={handlePasswordReset}>
                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem" }}>
                                    New Password *
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 characters)"
                                    minLength="6"
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        border: "2px solid #ddd",
                                        borderRadius: "10px",
                                        fontSize: "1rem",
                                        boxSizing: "border-box"
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "2rem" }}>
                                <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "600", fontSize: "1rem" }}>
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter your password"
                                    style={{
                                        width: "100%",
                                        padding: "12px 15px",
                                        border: "2px solid #ddd",
                                        borderRadius: "10px",
                                        fontSize: "1rem",
                                        boxSizing: "border-box"
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button 
                                    type="button"
                                    onClick={goBackToOtp}
                                    style={{
                                        flex: "1",
                                        padding: "12px",
                                        background: "transparent",
                                        color: "#E43636",
                                        border: "2px solid #E43636",
                                        borderRadius: "25px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isResetting}
                                    style={{
                                        flex: "2",
                                        padding: "12px",
                                        background: isResetting ? "#ccc" : "linear-gradient(45deg, #f97673, #E43636)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "25px",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        cursor: isResetting ? "not-allowed" : "pointer",
                                        transition: "all 0.3s ease"
                                    }}
                                >
                                    {isResetting ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem" }}>
                    Remember your password? <Link to="/signin" style={{ color: "#E43636", textDecoration: "none", fontWeight: "600" }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Reset_Password;
