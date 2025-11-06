import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import route from "./route/userRoute.js";
import dotenv from "dotenv";
import session from "express-session"; // ✅ import session

dotenv.config();
const app = express();

// ✅ Allow frontend requests
app.use(cors({
    origin: "http://localhost:3000",
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

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch(err => console.log("❌ DB Error:", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
