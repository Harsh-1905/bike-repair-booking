# 🚀 Production Deployment Guide

## 📁 Project Structure
```
/
├── src/                    # React frontend
├── server/                 # Node.js backend
├── package.json           # Frontend dependencies
├── server/package.json    # Backend dependencies
├── .env                   # Frontend environment variables
├── server/.env            # Backend environment variables
└── vercel.json           # Vercel deployment config
```

## 🌐 Deployment Setup

### **1. Backend Deployment (Render)**

#### **Step 1: Create Render Service**
1. Go to [render.com](https://render.com) and create account
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name:** `bikecare-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### **Step 2: Set Environment Variables in Render**
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/BikeCareDB
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
SESSION_SECRET=your_super_secret_session_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### **Step 3: Deploy Backend**
- Render will automatically deploy from your GitHub repository
- Your backend URL will be: `https://bikecare-backend.onrender.com`

### **2. Frontend Deployment (Vercel)**

#### **Step 1: Create Vercel Project**
1. Go to [vercel.com](https://vercel.com) and create account
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

#### **Step 2: Set Environment Variables in Vercel**
```env
REACT_APP_API_URL=https://bikecare-backend.onrender.com
```

#### **Step 3: Deploy Frontend**
- Vercel will automatically deploy
- Your frontend URL will be: `https://your-project.vercel.app`

## 🔧 Local Development Setup

### **Backend (server/ directory)**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your local configuration
npm run dev
```

### **Frontend (root directory)**
```bash
npm install
cp .env.example .env
# Edit .env with local backend URL
npm start
```

## 🔐 Environment Variables Reference

### **Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000  # Local development
# REACT_APP_API_URL=https://bikecare-backend.onrender.com  # Production
```

### **Backend (server/.env)**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/BikeCareDB
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxx
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing Deployment

### **Backend Health Check**
```bash
curl https://bikecare-backend.onrender.com/
# Should return: {"message": "BikeCare API is running!"}
```

### **Frontend API Connection**
1. Open browser developer tools
2. Check Network tab for API calls
3. Verify calls go to your Render backend URL

## 🔧 Troubleshooting

### **Common Issues:**

#### **CORS Errors**
- Ensure `FRONTEND_URL` is set correctly in Render
- Check that your Vercel domain is in the CORS allowedOrigins

#### **Environment Variables Not Loading**
- Verify variables are set in Render/Vercel dashboards
- Check variable names match exactly (case-sensitive)

#### **Database Connection Issues**
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check `MONGO_URI` format and credentials

#### **Build Failures**
- Check build logs in Render/Vercel dashboards
- Ensure all dependencies are in package.json

## 🎯 Production URLs

After deployment, update these in your documentation:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://bikecare-backend.onrender.com`
- **API Base:** `https://bikecare-backend.onrender.com/api`

## 🔄 Continuous Deployment

Both Render and Vercel will automatically redeploy when you push to your main branch:
1. Push code to GitHub
2. Render rebuilds backend automatically
3. Vercel rebuilds frontend automatically
4. No manual deployment needed!

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Database user has read/write permissions
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Razorpay keys are for production (live keys)
- [ ] All environment variables are set
- [ ] CORS configuration includes production domains
- [ ] Frontend uses environment variable for API URL
- [ ] Backend uses environment variables for all secrets