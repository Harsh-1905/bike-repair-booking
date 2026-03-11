import express from 'express';
import {
    createBookingOrder,
    createProductOrder,
    verifyBookingPayment,
    verifyProductPayment,
    handlePaymentFailure,
    handleWebhook
} from '../controller/paymentController.js';

const router = express.Router();

// Create Razorpay order for booking
router.post('/create-booking-order', createBookingOrder);

// Create Razorpay order for product purchase
router.post('/create-product-order', createProductOrder);

// Verify booking payment and create booking
router.post('/verify-booking-payment', verifyBookingPayment);

// Verify product payment and create order
router.post('/verify-product-payment', verifyProductPayment);

// Handle payment failure
router.post('/payment-failed', handlePaymentFailure);

// Webhook endpoint for Razorpay
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;