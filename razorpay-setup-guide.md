# Razorpay Integration Guide for BikeCare

## 1. Account Setup
1. Create account at https://razorpay.com
2. Complete KYC verification
3. Get API credentials from Dashboard > Settings > API Keys
   - Key ID (public key)
   - Key Secret (private key - keep secure!)

## 2. Install Dependencies

### Frontend (React)
```bash
npm install razorpay
```

### Backend (Node.js)
```bash
cd server
npm install razorpay
```

## 3. Environment Variables

Add to `server/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
```

## 4. Implementation Files to Create/Update

### Backend Files:
- `server/config/razorpay.js` - Razorpay configuration
- `server/controller/paymentController.js` - Payment handling
- `server/route/paymentRoute.js` - Payment routes
- Update `server/index.js` - Add payment routes

### Frontend Files:
- Update `src/Pages/Users/Booking/ServiceBilling.js` - Add Razorpay integration
- Create `src/utils/razorpay.js` - Razorpay utility functions

## 5. Payment Flow

1. User selects "Online Payment"
2. Frontend creates order via backend API
3. Backend creates Razorpay order
4. Frontend opens Razorpay checkout
5. User completes payment
6. Razorpay sends webhook to backend
7. Backend verifies payment and updates booking
8. Frontend shows success modal

## 6. Security Considerations

- Never expose Key Secret on frontend
- Always verify payments on backend
- Use webhooks for payment confirmation
- Implement proper error handling
- Log all payment transactions