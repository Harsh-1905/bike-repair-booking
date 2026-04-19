import express from "express";
import {
    bookSlot,
    getAvailableSlots,
    getAllBookings,
    getBookingInfo
} from "../controller/slotBookingController.js";

const router = express.Router();

// Main booking endpoint
router.post("/book-slot", bookSlot);

// Test booking endpoint with user authentication simulation
router.post("/book-slot-test", async (req, res) => {
    try {
        const { date, serviceType, userEmail } = req.body;
        
        // Find user by email to get real user ID
        if (userEmail) {
            try {
                const User = (await import("../model/userModel.js")).default;
                const user = await User.findOne({ email: userEmail });
                
                if (user) {
                    // Add real userId to the request body
                    req.body.userId = user._id;
                    console.log(`📧 Found user: ${user.fullName} (${user.email})`);
                } else {
                    console.log(`❌ User not found with email: ${userEmail}`);
                    return res.status(404).json({
                        success: false,
                        message: "User not found with provided email"
                    });
                }
            } catch (userError) {
                console.error("Error finding user:", userError);
                return res.status(500).json({
                    success: false,
                    message: "Error finding user"
                });
            }
        } else {
            // For testing without email, use a placeholder
            req.body.userId = null;
        }
        
        // Call the main booking function
        return bookSlot(req, res);
        
    } catch (error) {
        console.error("Test booking error:", error);
        res.status(500).json({
            success: false,
            message: "Test booking failed"
        });
    }
});

// Test notification creation endpoint
router.post("/create-test-notification", async (req, res) => {
    try {
        const { userEmail, message } = req.body;
        
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "userEmail is required"
            });
        }

        // Find user by email
        const User = (await import("../model/userModel.js")).default;
        const user = await User.findOne({ email: userEmail });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with provided email"
            });
        }

        // Create test notification
        const { createNotification } = await import("../controller/notificationController.js");
        
        const notification = await createNotification(
            user._id,
            "slot_booking_confirmed",
            "Workshop Reminder",
            message || `You can put your bike on workshop at 08:00 for your 9 AM - 11 AM slot on ${new Date().toISOString().split('T')[0]}.`
        );

        console.log(`📱 Test notification created for user: ${user.fullName} (${user.email})`);

        res.status(200).json({
            success: true,
            message: "Test notification created successfully",
            data: {
                notification,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email
                }
            }
        });

    } catch (error) {
        console.error("❌ Test notification creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create test notification",
            error: error.message
        });
    }
});

// Get available slots for a specific date
router.get("/slots/:date", getAvailableSlots);

// Get all bookings (for debugging/admin)
router.get("/all-bookings", getAllBookings);

// Get booking information (service types, slots, etc.)
router.get("/booking-info", getBookingInfo);

export default router;