import { useState } from "react";
import api from '../../Api/axios';
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [emailID, setEmailID] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleclickevent = async () => {
        // ✅ validations
        if (!emailID || !password) {
            showError("Please fill all fields");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailID)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const res = await api.post("/login", { email: emailID, password });

            if (res.data.success) {
                showSuccess(res.data.message);

                const loggedUser = res.data.user;
                setUser(loggedUser);
                localStorage.setItem("user", JSON.stringify(loggedUser));

                // ✅ redirect based on role
                if (loggedUser.userType === "admin") {
                    navigate("/adminDashboard");
                } else {
                    navigate("/userhomepage");
                }

                // clear inputs
                setEmailID("");
                setPassword("");
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
                    <h3 className="text-center">LOGIN</h3>
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
                    <div>
                        <input
                            type="password"
                            value={password}
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <button
                        className="btn w-full"
                        onClick={handleclickevent}
                        style={{ background: '#E43636', color: '#FFF', width: '250px' }}
                    >
                        Sign IN
                    </button>
                </div>
                <Link to="/forgotpassword" className="text-decoration-none">
                    Forgot Password?
                </Link>

            </div>
        </div>
    );
};

export default Login;
