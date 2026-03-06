import { useState } from "react";
import api from "../../Api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, useLocation } from "react-router-dom";

const Reset_Password = () => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // email passed from ForgotPassword page
    const email = location.state?.email;

    const handleclickevent = async () => {
        // ✅ basic validations
        if (!otp || !newPassword || !confirmPassword) {
            showError("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            showError("Password must be at least 6 characters");
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
        <div className="d-flex flex-column flex-md-row w-100 vh-100">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                    src="../images/bikecare7.jpg"
                    alt="Bike"
                    className="img-fluid h-70 w-70 object-fit-cover"
                />
            </div>

            <div
                className="col-12 col-md-6 border d-flex flex-column gap-4 align-items-center shadow-lg"
                style={{ paddingTop: "110px" }}
            >
                <div>
                    <h3 className="text-center">Reset Password</h3>
                </div>

                <div className="d-flex flex-column gap-4 col-10">
                    <div>
                        <input
                            type="text"
                            value={otp}
                            className="form-control"
                            placeholder="Enter OTP"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={newPassword}
                            className="form-control"
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            value={confirmPassword}
                            className="form-control"
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        className="btn w-full"
                        onClick={handleclickevent}
                        style={{ background: "#E43636", color: "#FFF", width: "250px" }}
                    >
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reset_Password;
