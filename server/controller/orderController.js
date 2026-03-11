import Order from "../model/orderModel.js";
import User from "../model/userModel.js";

// Create new order
export const createOrder = async (req, res) => {
    try {
        const { user_id, items, shippingAddress, totalAmount, paymentMethod } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const order = new Order({
            user_id,
            items,
            shippingAddress,
            totalAmount,
            paymentMethod,
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Failed to create order", error: error.message });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const user_id = req.user._id;

        const orders = await Order.find({ user_id })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ message: "Failed to update order", error: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
            return res.status(400).json({ message: "Cannot cancel shipped or delivered orders" });
        }

        order.orderStatus = "Cancelled";
        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({ message: "Failed to cancel order", error: error.message });
    }
};
