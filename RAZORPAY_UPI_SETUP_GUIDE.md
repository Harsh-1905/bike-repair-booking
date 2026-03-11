# 🚀 Razorpay UPI-Only Payment Setup Guide

## 📋 Complete Implementation for BikeCare

### 🔧 **1. Install Dependencies**

```bash
# Backend
cd server
npm install razorpay

# Frontend (no additional packages needed)
```

### 🔑 **2. Get Razorpay API Keys**

1. **Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)**
2. **Go to Settings > API Keys**
3. **Generate Test Keys:**
   - Key ID: `rzp_test_xxxxxxxxxx`
   - Key Secret: `xxxxxxxxxxxxxxxxxx`
4. **For Webhooks:** Settings > Webhooks > Generate Secret

### 🌐 **3. Environment Setup**

Replace the placeholder values in `server/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 🎯 **4. Features Implemented**

#### **For Service Bookings:**
- ✅ Cash on Service payment
- ✅ UPI-only online payment
- ✅ Payment verification
- ✅ Booking creation after successful payment

#### **For Product Orders:**
- ✅ Cash on Delivery (COD)
- ✅ UPI-only online payment
- ✅ Payment verification
- ✅ Order creation after successful payment

### 🔒 **5. UPI-Only Configuration**

The payment modal will show **ONLY UPI options**:
- PhonePe
- Google Pay
- Paytm
- BHIM UPI
- Other UPI apps

**No Cards, Net Banking, or Wallets** will be displayed.

### 📱 **6. Payment Flow**

#### **Service Booking Flow:**
1. User selects service and fills details
2. Goes to billing page
3. Chooses "UPI Payment"
4. Razorpay UPI-only modal opens
5. User pays via UPI
6. Payment verified on backend
7. Booking created and success modal shown

#### **Product Order Flow:**
1. User adds items to cart
2. Goes to checkout
3. Fills shipping address
4. Chooses "UPI Payment"
5. Razorpay UPI-only modal opens
6. User pays via UPI
7. Payment verified on backend
8. Order created and success page shown

### 🧪 **7. Testing**

#### **Test UPI IDs (Razorpay Test Mode):**
- **Success Payment:** `success@razorpay`
- **Failed Payment:** `failure@razorpay`

#### **Test Flow:**
1. Select UPI payment
2. Enter test UPI ID
3. Complete payment
4. Verify booking/order creation

### 🔐 **8. Security Features**

- ✅ **Server-side signature verification**
- ✅ **Payment amount validation**
- ✅ **Order ID verification**
- ✅ **Webhook backup confirmation**
- ✅ **Secure API key handling**

### 📊 **9. Database Updates**

#### **Booking Model:**
- Added `razorpayOrderId`
- Added `razorpayPaymentId`
- Updated `paymentStatus` enum

#### **Order Model:**
- Added `paymentStatus` field
- Added `razorpayOrderId`
- Added `razorpayPaymentId`

### 🌐 **10. API Endpoints**

```
POST /api/payment/create-booking-order    # Create booking payment order
POST /api/payment/create-product-order    # Create product payment order
POST /api/payment/verify-booking-payment  # Verify booking payment
POST /api/payment/verify-product-payment  # Verify product payment
POST /api/payment/payment-failed          # Handle payment failures
POST /api/payment/webhook                 # Razorpay webhook handler
```

### 🚀 **11. Production Deployment**

#### **Before Going Live:**
1. **Replace test keys with live keys**
2. **Set up webhook URL:** `https://yourdomain.com/api/payment/webhook`
3. **Configure webhook events:** `payment.captured`, `payment.failed`
4. **Test with real UPI payments**
5. **Set up monitoring and logging**

#### **Webhook Configuration:**
1. Go to Razorpay Dashboard > Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to environment variables

### 💡 **12. Benefits**

- **User-Friendly:** Simple UPI payments
- **Secure:** Industry-standard security
- **Fast:** Instant payment confirmation
- **Reliable:** Webhook backup system
- **Mobile-First:** Perfect for Indian market

### 🔧 **13. Troubleshooting**

#### **Common Issues:**
- **Script not loading:** Check internet connection
- **Payment failing:** Verify API keys
- **Webhook not working:** Check URL and secret

#### **Debug Steps:**
1. Check browser console for errors
2. Verify API keys in .env file
3. Test with Razorpay test UPI IDs
4. Check server logs for payment verification

### 📞 **14. Support**

- **Razorpay Docs:** https://razorpay.com/docs/
- **UPI Integration:** https://razorpay.com/docs/payments/payment-methods/upi/
- **Test Credentials:** https://razorpay.com/docs/payments/test-card-details/

---

## 🎉 **Ready to Use!**

Your BikeCare website now supports:
- ✅ UPI payments for service bookings
- ✅ UPI payments for product orders
- ✅ Secure payment verification
- ✅ Professional payment experience

Just add your Razorpay API keys and start accepting UPI payments!