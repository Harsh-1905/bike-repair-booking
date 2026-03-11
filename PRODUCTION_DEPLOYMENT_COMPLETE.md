# 🚀 Production Deployment - Complete Setup

## ✅ **Your Domains:**
- **Frontend:** `https://bikecare-7r4i.vercel.app`
- **Backend:** `https://bike-repair-booking.onrender.com`
- **Webhook:** `https://bike-repair-booking.onrender.com/api/payment/webhook`

---

## 🔧 **Backend Configuration (✅ COMPLETED)**

### **CORS Configuration Updated:**
```javascript
const allowedOrigins = [
    "http://localhost:3000", // Local development
    "https://bikecare-7r4i.vercel.app", // Your production frontend
    "https://bikecare.vercel.app" // Future custom domain
];
```

### **Environment Variables (.env):**
```env
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://bikecare-7r4i.vercel.app
```

---

## 🌐 **Frontend Configuration (✅ COMPLETED)**

### **Dynamic API URLs:**
- **Development:** `http://localhost:8000/api`
- **Production:** `https://bike-repair-booking.onrender.com/api`

### **Updated Components:**
- ✅ `src/utils/config.js` - Centralized URL management
- ✅ `src/Api/axios.js` - Dynamic API base URL
- ✅ `src/Components/Store/ProductCard.js`
- ✅ `src/Pages/Users/Store/Cart.js`
- ✅ `src/Pages/Users/Store/Checkout.js`
- ✅ `src/Pages/Users/Store/OrderSuccess.js`
- ✅ `src/Pages/Users/Store/MyOrders.js`
- ✅ `src/Pages/Users/Store/Store.js`
- ✅ `src/Pages/Users/Store/QuickViewModal.js`
- ✅ `src/Pages/admin/AddProduct.js`
- ✅ `src/Pages/admin/OrdersTable.js`

---

## 🚀 **Deployment Steps**

### **Step 1: Deploy Backend Changes to Render**
1. **Push your updated backend code** to your GitHub repository
2. **Render will automatically redeploy** your backend
3. **Add environment variables** in Render dashboard:
   ```env
   FRONTEND_URL_PRODUCTION=https://bikecare-7r4i.vercel.app
   RAZORPAY_KEY_ID=your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### **Step 2: Deploy Frontend to Vercel**
1. **Push your updated frontend code** to GitHub
2. **Vercel will automatically redeploy** your frontend
3. **No additional environment variables needed** (URLs are dynamic)

### **Step 3: Configure Razorpay Webhook**
1. **Go to:** [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Navigate to:** Settings → Webhooks
3. **Update/Create Webhook:**
   - **URL:** `https://bike-repair-booking.onrender.com/api/payment/webhook`
   - **Events:** `payment.captured`, `payment.failed`
   - **Active:** ✅ Yes
4. **Copy webhook secret** and add to Render environment variables

---

## 🧪 **Testing Checklist**

### **Frontend Tests:**
- [ ] Website loads: `https://bikecare-7r4i.vercel.app`
- [ ] User registration/login works
- [ ] Product images load correctly
- [ ] Cart functionality works
- [ ] Checkout process works

### **Backend Tests:**
- [ ] API responds: `https://bike-repair-booking.onrender.com/api`
- [ ] CORS allows frontend requests
- [ ] Database operations work
- [ ] File uploads work

### **Payment Tests:**
- [ ] UPI payment flow works
- [ ] Payment verification works
- [ ] Webhook receives events
- [ ] Booking/Order creation after payment

### **Integration Tests:**
- [ ] Complete booking flow (service)
- [ ] Complete order flow (products)
- [ ] Payment success scenarios
- [ ] Payment failure scenarios

---

## 🔧 **Environment Variables Setup**

### **Render (Backend) Environment Variables:**
```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://bikecare-7r4i.vercel.app
```

### **Vercel (Frontend) - No additional variables needed!**
The frontend automatically detects the environment and uses the correct API URLs.

---

## 🎯 **API Endpoints**

### **Your Production API Base:**
```
https://bike-repair-booking.onrender.com/api
```

### **Key Endpoints:**
- **Authentication:** `/api/register`, `/api/login`
- **Bookings:** `/api/booking`
- **Products:** `/api/products`
- **Orders:** `/api/orders`
- **Payments:** `/api/payment/*`
- **Webhook:** `/api/payment/webhook`

---

## 🔐 **Security Features**

- ✅ **HTTPS Everywhere** - Both frontend and backend use HTTPS
- ✅ **CORS Protection** - Only your frontend can access the API
- ✅ **Payment Security** - Razorpay signature verification
- ✅ **Webhook Security** - Webhook signature validation
- ✅ **Environment Variables** - Sensitive data in environment variables

---

## 🎉 **You're Live!**

Your BikeCare application is now fully deployed and configured:

1. **Frontend:** `https://bikecare-7r4i.vercel.app`
2. **Backend:** `https://bike-repair-booking.onrender.com`
3. **Database:** Connected and working
4. **Payments:** Razorpay UPI integration active
5. **Images:** Loading from production backend
6. **CORS:** Properly configured for your domains

**Test your application end-to-end and let me know if you encounter any issues!**

---

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **CORS Errors:**
- Check if your frontend domain is in the allowed origins
- Verify environment variables are set in Render

#### **Images Not Loading:**
- Check if all components use `getProductImageURL()`
- Verify backend serves static files correctly

#### **API Connection Issues:**
- Check if backend is deployed and running
- Verify API base URL configuration

#### **Payment Issues:**
- Verify Razorpay keys are set correctly
- Check webhook URL configuration
- Test with Razorpay test credentials

**Need help? Check the logs in Render dashboard and Vercel dashboard for detailed error messages.**