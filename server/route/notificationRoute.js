import express from "express";
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getAdminNotifications
} from "../controller/notificationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for user
router.get("/", requireAuth, getUserNotifications);

// Get unread notification count
router.get("/unread-count", requireAuth, getUnreadCount);

// Mark specific notification as read
router.put("/:notificationId/read", requireAuth, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", requireAuth, markAllAsRead);

// Get admin notifications (for dashboard)
router.get("/admin", getAdminNotifications);

export default router;