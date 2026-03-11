import axios from "axios";

// Get API base URL from environment variable
const getBaseURL = () => {
    return process.env.REACT_APP_API_URL || "http://localhost:5000";
};

const api = axios.create({
    baseURL: `${getBaseURL()}/api`,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
});

// Add request interceptor to include user_id from localStorage
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            // Add user_id to headers
            config.headers['x-user-id'] = userData._id;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
