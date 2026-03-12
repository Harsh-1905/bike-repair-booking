import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
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
