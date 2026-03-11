// Configuration utility for API URLs

// Get the base API URL based on environment
export const getApiBaseURL = () => {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:8000";
    }
    return "https://bike-repair-booking.onrender.com";
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