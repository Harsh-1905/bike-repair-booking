import axios from "axios";

// Determine the API base URL based on environment
const getBaseURL = () => {
    // Check if we're in development or production
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:8000/api";
    }
    
    // Production backend URL
    return "https://bike-repair-booking.onrender.com/api";
};

const api = axios.create({
    baseURL: getBaseURL(),
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
