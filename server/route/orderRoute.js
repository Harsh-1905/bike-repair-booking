import express from "express";
const router = express.Router();
import * as orderController from "../controller/orderController.js";
import { authenticate } from "../controller/userController.js";

// IMPORTANT: Specific routes MUST come before parameterized routes
// Admin routes - must be before :id routes
router.get("/orders/all", authenticate, orderController.getAllOrders);
router.get("/orders/user", authenticate, orderController.getUserOrders);

// User routes
router.post("/orders", authenticate, orderController.createOrder);
router.get("/orders/:id", authenticate, orderController.getOrderById);
router.put("/orders/:id/cancel", authenticate, orderController.cancelOrder);
router.put("/orders/:id/status", authenticate, orderController.updateOrderStatus);

export default router;
