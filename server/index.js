import "dotenv/config";
console.log("ENV TEST PORT:", process.env.PORT);
console.log("ENV TEST MAILTRAP:", process.env.MAILTRAP_HOST);

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import route from "./route/userRoute.js";
import session from "express-session"; // ✅ import session
import passwordRoutes from "./route/passwordRoute.js";
import productRoute from "./route/productRoute.js";
import orderRoute from "./route/orderRoute.js";
import mechanicRoute from "./route/mechanicRoute.js";
import paymentRoute from "./route/paymentRoute.js";


const app = express();

// ✅ Allow frontend requests from multiple origins
const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL || "http://localhost:3000", // Local development
    process.env.FRONTEND_URL_PRODUCTION, // Production frontend from env
    "https://bikecare-7r4i.vercel.app", // Your actual frontend domain
    "https://bikecare.vercel.app" // In case you get a custom domain later
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // important for sending cookies
}));

app.use(express.json());

// ✅ Initialize express-session middleware BEFORE routes
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
    }
}));

// ✅ All API routes start with /api
app.use("/api", route);
app.use("/api/products", productRoute);
app.use("/api", orderRoute);
app.use("/api", mechanicRoute);
app.use("/api/payment", paymentRoute);
app.use("/uploads", express.static("uploads"));
app.use("/api", passwordRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

