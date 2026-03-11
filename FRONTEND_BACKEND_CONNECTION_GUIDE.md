# 🌐 Frontend-Backend Connection Guide

## 📋 **Complete Setup for Production Deployment**

### **Your Current Setup:**
- **Backend:** `https://bike-repair-booking.onrender.com`
- **Frontend:** `[Your Frontend Domain]` (to be deployed)

---

## 🔧 **Step 1: Backend Configuration (Already Done)**

### **✅ CORS Configuration Updated**
- Supports multiple frontend domains
- Environment-based origin handling
- Proper error logging for blocked origins

### **✅ API Configuration**
- Dynamic base URL based on environment
- Production URL: `https://bike-repair-booking.onrender.com/api`
- Development URL: `http://localhost:8000/api`

---

## 🌐 **Step 2: Frontend Deployment Options**

### **Option A: Vercel (Recommended)**
1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Your frontend URL will be:**
   ```
   https://your-project-name.vercel.app
   ```

### **Option B: Netlify**
1. **Push your code to GitHub**
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Your frontend URL will be:**
   ```
   https://your-project-name.netlify.app
   ```

### **Option C: Custom Domain**
- Purchase a domain (e.g., `bikecare.com`)
- Point it to your hosting provider
- Configure DNS settings

---

## 🔧 **Step 3: Update Backend CORS with Your Frontend Domain**

Once you have your frontend domain, update the backend:

### **In `server/index.js`:**
```javascript
const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL || "http://localhost:3000",
    process.env.FRONTEND_URL_PRODUCTION,
    "https://your-actual-frontend-domain.vercel.app", // ← Update this
    "https://your-custom-domain.com" // ← Or this
].filter(Boolean);
```

### **In `server/.env` (on Render):**
```env
FRONTEND_URL_PRODUCTION=https://your-actual-frontend-domain.vercel.app
```

---

## 🔧 **Step 4: Environment Variables Setup**

### **Backend Environment Variables (Render Dashboard):**
```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
FRONTEND_URL_LOCAL=http://localhost:3000
FRONTEND_URL_PRODUCTION=https://your-frontend-domain.vercel.app
```

### **Frontend Environment Variables (Vercel/Netlify):**
```env
REACT_APP_API_URL=https://bike-repair-booking.onrender.com/api
NODE_ENV=production
```

---

## 🔧 **Step 5: Update Remaining Hardcoded URLs**

I've started updating the components, but you need to update these files:

### **Files to Update:**
1. `src/Pages/admin/AddProduct.js` - Line 68
2. `src/Pages/admin/OrdersTable.js` - Line 212
3. `src/Pages/Users/Store/MyOrders.js` - Line 121
4. `src/Pages/Users/Store/OrderSuccess.js` - Line 95
5. `src/Pages/Users/Store/QuickViewModal.js` - Line 34
6. `src/Pages/Users/Store/Store.js` - Line 24

### **Replace all instances of:**
```javascript
// OLD
src={`http://localhost:8000/uploads/productimages/${item.image}`}

// NEW
import { getProductImageURL } from "../../../utils/config";
src={getProductImageURL(item.image)}
```

---

## 🚀 **Step 6: Deployment Process**

### **Backend (Render) - Already Deployed ✅**
- URL: `https://bike-repair-booking.onrender.com`
- Status: ✅ Active

### **Frontend Deployment Steps:**

#### **For Vercel:**
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd your-frontend-folder
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `build`

#### **For Netlify:**
1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Drag and drop `build` folder** to Netlify dashboard
   OR
3. **Connect GitHub repository** for automatic deployments

---

## 🔧 **Step 7: Testing the Connection**

### **Test Checklist:**
- [ ] Frontend loads without errors
- [ ] API calls work (login, registration)
- [ ] Images load correctly
- [ ] Payment flow works
- [ ] CORS errors are resolved

### **Common Issues & Solutions:**

#### **CORS Errors:**
```
Access to XMLHttpRequest at 'https://bike-repair-booking.onrender.com/api/...' 
from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```
**Solution:** Add your frontend domain to backend CORS configuration

#### **Image Loading Issues:**
```
Failed to load resource: net::ERR_FAILED
```
**Solution:** Update all hardcoded localhost URLs to use the config utility

#### **API Connection Issues:**
```
Network Error / 500 Internal Server Error
```
**Solution:** Check backend logs and ensure environment variables are set

---

## 📱 **Step 8: Final Configuration**

### **Update Razorpay Webhook URL:**
1. Go to Razorpay Dashboard
2. Update webhook URL to: `https://bike-repair-booking.onrender.com/api/payment/webhook`
3. Test webhook with a payment

### **Update Frontend API Calls:**
- All API calls will automatically use production URL when deployed
- Local development will continue using localhost

---

## 🎉 **You're Ready!**

Once you complete these steps:
- ✅ Backend: `https://bike-repair-booking.onrender.com`
- ✅ Frontend: `https://your-frontend-domain.vercel.app`
- ✅ Database: Connected and working
- ✅ Payments: Razorpay integrated with webhooks
- ✅ Images: Loading from production backend

**What's your frontend domain going to be?** Let me know and I'll help you update the specific CORS configuration!