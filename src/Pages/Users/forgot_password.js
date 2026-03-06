import { useState } from "react";
import api from '../../Api/axios';
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, Link } from 'react-router-dom';

const Forgot_Password = ({ setUser }) => {
    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleclickevent = async () => {
        // ✅ validations
        if (!emailID) {
            showError("Please enter email");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailID)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            // ✅ call forgot-password API (NOT login)
            const res = await api.post("/forgotpassword", { email: emailID });

            if (res.data.success) {
                showSuccess(res.data.message || "OTP sent successfully");

                // ✅ navigate to reset password page with email
                navigate("/resetpassword", {
                    state: { email: emailID }
                });

                // clear input
                setEmailID("");
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

            <div className="col-12 col-md-6 border d-flex flex-column gap-4 align-items-center shadow-lg" style={{ paddingTop: '110px' }}>
                <div>
                    <h3 className="text-center">Enter Email</h3>
                </div>
                <div className="d-flex flex-column gap-4 col-10">
                    <div>
                        <input
                            type="text"
                            value={emailID}
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => setEmailID(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button
                        className="btn w-full"
                        onClick={handleclickevent}
                        style={{ background: '#E43636', color: '#FFF', width: '250px' }}
                    >
                        Send OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forgot_Password;
