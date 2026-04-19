import Notification from "../model/notificationModel.js";

// Create a new notification
const createNotification = async (userId, type, title, message, bookingId = null, orderId = null) => {
    try {
        const notification = new Notification({
            user_id: userId,
            type,
            title,
            message,
            booking_id: bookingId,
            order_id: orderId
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ user_id: userId })
            .populate('booking_id')
            .populate('order_id')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        await Notification.findOneAndUpdate(
            { _id: notificationId, user_id: userId },
            { isRead: true }
        );

        res.json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read"
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { user_id: userId, isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read"
        });
    }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await Notification.countDocuments({
            user_id: userId,
            isRead: false
        });

        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error("Error getting unread count:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get unread count"
        });
    }
};

// Get admin notifications (for dashboard)
const getAdminNotifications = async (req, res) => {
    try {
        // Get admin notifications (profile updates and booking updates)
        const notifications = await Notification.find({
            type: { $in: ["admin_profile_updated", "admin_booking_updated"] }
        })
        .populate('user_id', 'fullName firstName lastName')
        .populate('booking_id', 'bikeService bikeCompany bikeModel')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin notifications"
        });
    }
};

// Helper functions for creating specific notifications
const createSlotBookingNotification = async (userId, slotTime, reportingTime, date, serviceType) => {
    const title = "Workshop Reminder";
    const message = `You can put your bike on workshop at ${reportingTime} for your ${slotTime} slot on ${date}.`;
    
    return await createNotification(userId, "slot_booking_confirmed", title, message);
};

const createSlotReminderNotification = async (userId, reportingTime, slotTime, date) => {
    const title = "Workshop Reminder";
    const message = `You can put your bike on workshop at ${reportingTime} for your ${slotTime} slot today (${date}).`;
    
    return await createNotification(userId, "slot_reminder", title, message);
};

const createBookingNotification = async (userId, type, bookingId, mechanicName = null) => {
    let title, message;
    
    switch (type) {
        case "mechanic_assigned":
            title = "Mechanic Assigned";
            message = `Great news! ${mechanicName} has been assigned to your bike service.`;
            break;
        case "booking_confirmed":
            title = "Booking Confirmed";
            message = "Your bike service booking has been confirmed.";
            break;
        case "booking_in_progress":
            title = "Service In Progress";
            message = "Your bike repair is now in progress. Our mechanic is working on it.";
            break;
        case "booking_completed":
            title = "Service Completed";
            message = "Great news! Your bike service has been completed successfully.";
            break;
        default:
            title = "Booking Update";
            message = "Your booking status has been updated.";
    }
    
    return await createNotification(userId, type, title, message, bookingId);
};

const createOrderNotification = async (userId, type, orderId) => {
    let title, message;
    
    switch (type) {
        case "order_confirmed":
            title = "Order Confirmed";
            message = "Your order has been confirmed and is being prepared.";
            break;
        case "order_processing":
            title = "Order Processing";
            message = "Your order is being processed and will be shipped soon.";
            break;
        case "order_shipped":
            title = "Order Shipped";
            message = "Your order has been shipped and is on its way to you.";
            break;
        case "order_delivered":
            title = "Order Delivered";
            message = "Your order has been delivered successfully. Thank you for shopping with us!";
            break;
        default:
            title = "Order Update";
            message = "Your order status has been updated.";
    }
    
    return await createNotification(userId, type, title, message, null, orderId);
};

// Create admin notification for profile updates
const createAdminProfileNotification = async (userId, userName) => {
    try {
        // Find admin users
        const User = (await import("../model/userModel.js")).default;
        const adminUsers = await User.find({ userType: "admin" });
        
        const notifications = [];
        for (const admin of adminUsers) {
            const notification = await createNotification(
                admin._id,
                "admin_profile_updated",
                "User Profile Updated",
                `Customer (${userName}) has updated their profile information.`,
                null,
                null
            );
            notifications.push(notification);
        }
        
        return notifications;
    } catch (error) {
        console.error("Error creating admin profile notification:", error);
        throw error;
    }
};

// Create admin notification for booking updates
const createAdminBookingNotification = async (userId, userName, bookingId, updateType) => {
    try {
        // Find admin users
        const User = (await import("../model/userModel.js")).default;
        const adminUsers = await User.find({ userType: "admin" });
        
        let message = "";
        switch (updateType) {
            case "updated":
                message = `Customer (${userName}) has updated their service booking details.`;
                break;
            case "cancelled":
                message = `Customer (${userName}) has cancelled their service booking.`;
                break;
            default:
                message = `Customer (${userName}) has modified their service booking.`;
        }
        
        const notifications = [];
        for (const admin of adminUsers) {
            const notification = await createNotification(
                admin._id,
                "admin_booking_updated",
                "Service Booking Updated",
                message,
                bookingId,
                null
            );
            notifications.push(notification);
        }
        
        return notifications;
    } catch (error) {
        console.error("Error creating admin booking notification:", error);
        throw error;
    }
};

export {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getAdminNotifications,
    createSlotBookingNotification,
    createSlotReminderNotification,
    createBookingNotification,
    createOrderNotification,
    createAdminProfileNotification,
    createAdminBookingNotification
};