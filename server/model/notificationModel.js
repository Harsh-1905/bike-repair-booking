import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registration",
        required: true
    },
    type: {
        type: String,
        enum: [
            "mechanic_assigned",
            "booking_confirmed", 
            "booking_in_progress",
            "booking_completed",
            "slot_booking_confirmed",
            "slot_reminder",
            "order_confirmed",
            "order_processing",
            "order_shipped",
            "order_delivered",
            "admin_profile_updated",
            "admin_booking_updated"
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;