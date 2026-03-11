// Configuration utility for API URLs

// Get the base API URL from environment variable
export const getApiBaseURL = () => {
    return process.env.REACT_APP_API_URL || "http://localhost:5000";
};

// Get the full API URL
export const getApiURL = (endpoint = '') => {
    return `${getApiBaseURL()}/api${endpoint}`;
};

// Get the uploads URL for images
export const getUploadsURL = (imagePath) => {
    return `${getApiBaseURL()}/uploads/${imagePath}`;
};

// Get product image URL
export const getProductImageURL = (imageName) => {
    return `${getApiBaseURL()}/uploads/productimages/${imageName}`;
};