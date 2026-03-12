// Razorpay utility functions for localhost

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

// Initialize Razorpay payment
export const initializeRazorpayPayment = (options) => {
    return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
            ...options,
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