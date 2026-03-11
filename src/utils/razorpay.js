// Razorpay utility functions for UPI-only payments

// Load Razorpay script
export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Initialize Razorpay payment with UPI-only configuration
export const initializeRazorpayPayment = (options) => {
    return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
            ...options,
            // UPI-only configuration
            config: {
                display: {
                    blocks: {
                        utib: {
                            name: 'Pay using UPI',
                            instruments: [
                                {
                                    method: 'upi'
                                }
                            ]
                        }
                    },
                    sequence: ['block.utib'],
                    preferences: {
                        show_default_blocks: false
                    }
                }
            },
            handler: function (response) {
                resolve(response);
            },
            modal: {
                ondismiss: function () {
                    reject(new Error('Payment cancelled by user'));
                }
            }
        });
        
        razorpay.open();
    });
};

// Format amount for display
export const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

// Validate payment response
export const validatePaymentResponse = (response) => {
    return (
        response.razorpay_payment_id &&
        response.razorpay_order_id &&
        response.razorpay_signature
    );
};

// Create booking payment order
export const createBookingPaymentOrder = async (api, bookingData, totalAmount) => {
    try {
        const response = await api.post('/payment/create-booking-order', {
            amount: totalAmount,
            bookingData
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
};

// Create product payment order
export const createProductPaymentOrder = async (api, orderData, totalAmount) => {
    try {
        const response = await api.post('/payment/create-product-order', {
            amount: totalAmount,
            orderData
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
};

// Verify booking payment
export const verifyBookingPayment = async (api, paymentResponse, bookingData) => {
    try {
        const response = await api.post('/payment/verify-booking-payment', {
            ...paymentResponse,
            bookingData
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};

// Verify product payment
export const verifyProductPayment = async (api, paymentResponse, orderData) => {
    try {
        const response = await api.post('/payment/verify-product-payment', {
            ...paymentResponse,
            orderData
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};