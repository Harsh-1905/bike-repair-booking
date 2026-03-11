import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import route from "./route/userRoute.js";
import session from "express-session";
import passwordRoutes from "./route/passwordRoute.js";
import productRoute from "./route/productRoute.js";
import orderRoute from "./route/orderRoute.js";
import mechanicRoute from "./route/mechanicRoute.js";
import paymentRoute from "./route/paymentRoute.js";

const app = express();

// CORS Configuration for production deployment
const allowedOrigins = [
    "http://localhost:3000", // Local development frontend
    "http://localhost:5000", // Local development alternative
    process.env.FRONTEND_URL, // Production frontend from environment
    "https://bikecare-7r4i.vercel.app", // Your Vercel deployment
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    }
}));

// API Routes
app.use("/api", route);
app.use("/api/products", productRoute);
app.use("/api", orderRoute);
app.use("/api", mechanicRoute);
app.use("/api/payment", paymentRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api", passwordRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ message: "BikeCare API is running!" });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL;
        if (!mongoURI) {
            throw new Error("MongoDB URI not found in environment variables");
        }
        
        await mongoose.connect(mongoURI);
        console.log("✅ Database Connected Successfully");
    } catch (error) {
        console.error("❌ DB Connection Error:", error.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

