import express from 'express';
import {
    createBookingOrder,
    createProductOrder,
    verifyBookingPayment,
    verifyProductPayment,
    handlePaymentFailure
} from '../controller/paymentController.js';

const router = express.Router();

// Create Razorpay order for service booking
router.post('/create-booking-order', createBookingOrder);

// Create Razorpay order for product purchase
router.post('/create-product-order', createProductOrder);

// Verify booking payment and create booking
router.post('/verify-booking-payment', verifyBookingPayment);

// Verify product payment and create order
router.post('/verify-product-payment', verifyProductPayment);

// Handle payment failure
router.post('/payment-failed', handlePaymentFailure);

export default router;