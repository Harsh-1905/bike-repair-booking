import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import Booking from '../model/bookModel.js';
import Order from '../model/orderModel.js';

// Create Razorpay order for booking
export const createBookingOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', bookingData } = req.body;

        // Create order options
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `booking_${Date.now()}`,
            notes: {
                bookingType: 'service',
                bikeModel: bookingData.bikeModel,
                bikeNumPlate: bookingData.bikeNumPlate,
                serviceType: bookingData.bikeService
            }
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay booking order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Create Razorpay order for product purchase
export const createProductOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', orderData } = req.body;

        // Create order options
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `order_${Date.now()}`,
            notes: {
                orderType: 'product',
                itemCount: orderData.items?.length || 0,
                customerEmail: orderData.email
            }
        };

        // Create order with Razorpay
        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating Razorpay product order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Verify booking payment and create booking
export const verifyBookingPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Payment verified, create booking
        const finalBookingData = {
            ...bookingData,
            paymentMethod: 'online',
            paymentStatus: 'paid',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        };

        const newBooking = new Booking(finalBookingData);
        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: 'Payment verified and booking created successfully!',
            data: savedBooking
        });

    } catch (error) {
        console.error('Error verifying booking payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Verify product payment and create order
export const verifyProductPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Payment verified, create order
        const finalOrderData = {
            ...orderData,
            paymentMethod: 'online',
            paymentStatus: 'paid',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        };

        const newOrder = new Order(finalOrderData);
        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Payment verified and order created successfully!',
            data: savedOrder
        });

    } catch (error) {
        console.error('Error verifying product payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Handle payment failure
export const handlePaymentFailure = async (req, res) => {
    try {
        const { error, orderType } = req.body;

        // Log payment failure
        console.error(`${orderType} payment failed:`, error);

        res.status(200).json({
            success: false,
            message: 'Payment failed',
            error: error
        });

    } catch (error) {
        console.error('Error handling payment failure:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment failure',
            error: error.message
        });
    }
};

// Webhook handler for payment updates
export const handleWebhook = async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookBody = JSON.stringify(req.body);

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(webhookBody)
            .digest('hex');

        if (webhookSignature !== expectedSignature) {
            return res.status(400).json({ message: 'Invalid webhook signature' });
        }

        const event = req.body.event;
        const paymentEntity = req.body.payload.payment.entity;

        switch (event) {
            case 'payment.captured':
                // Update booking/order status to confirmed
                await Promise.all([
                    Booking.findOneAndUpdate(
                        { razorpayPaymentId: paymentEntity.id },
                        { paymentStatus: 'paid', status: 'confirmed' }
                    ),
                    Order.findOneAndUpdate(
                        { razorpayPaymentId: paymentEntity.id },
                        { paymentStatus: 'paid', status: 'confirmed' }
                    )
                ]);
                break;

            case 'payment.failed':
                // Update booking/order status to failed
                await Promise.all([
                    Booking.findOneAndUpdate(
                        { razorpayOrderId: paymentEntity.order_id },
                        { paymentStatus: 'failed', status: 'cancelled' }
                    ),
                    Order.findOneAndUpdate(
                        { razorpayOrderId: paymentEntity.order_id },
                        { paymentStatus: 'failed', status: 'cancelled' }
                    )
                ]);
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.status(200).json({ message: 'Webhook processed successfully' });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
};