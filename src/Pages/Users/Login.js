import { useState } from "react";
import api from '../../Api/axios';
import { showError, showSuccess } from "../../utils/toast";
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            showError("Please fill all fields");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("Please enter a valid email address");
            return;
        }

        try {
            const res = await api.post("/login", { email, password });

            if (res.data.success) {
                showSuccess(res.data.message);

                const loggedUser = res.data.user;
                setUser(loggedUser);
                localStorage.setItem("user", JSON.stringify(loggedUser));

                // Redirect based on role
                if (loggedUser.userType === "admin") {
                    navigate("/adminDashboard");
                } else {
                    navigate("/userhomepage");
                }
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
                    Welcome Back
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
                    Login to continue to BikeCare
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            Password *
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        Login
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                    <Link to="/forgotpassword" style={{ color: "#E43636", textDecoration: "none" }}>
                        Forgot Password?
                    </Link>
                </p>

                <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                    Don't have an account? <Link to="/signup" style={{ color: "#E43636", textDecoration: "none" }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
