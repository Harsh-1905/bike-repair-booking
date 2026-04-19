import User from "../model/userModel.js";
import Booking from "../model/bookModel.js";
import Contact from "../model/contactmodel.js";
import bcrypt from "bcryptjs";
import { createBookingNotification, createSlotBookingNotification } from "./notificationController.js";
import slotManager from "../utils/slotManager.js";



export const create = async (req, res) => {
    try {

        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedData = await newUser.save();

        const { password: pw, ...userWithoutPassword } = savedData.toObject();

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find().sort({ createdAt: -1 });
        if (!userData || userData.length === 0) {
            return res.status(404).json({ success: false, message: "User data not found" });
        }
        res.status(200).json({
            success: true,
            users: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ compare plain password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // hide password
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        // save session
        req.session.user = userWithoutPassword;

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get a single user by ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // hide password
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');

        if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

        // Send admin notification for profile update
        try {
            const { createAdminProfileNotification } = await import("./notificationController.js");
            const userName = updatedUser.fullName || `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || 'Customer';
            await createAdminProfileNotification(updatedUser._id, userName);
        } catch (notificationError) {
            console.error("Error sending admin profile notification:", notificationError);
            // Don't fail the update if notification fails
        }

        res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        console.log("Received booking data:", req.body);

        // 🔎 Check if booking already exists for same bike and date
        const existing = await Booking.findOne({
            date: req.body.date,
            bikeNumPlate: req.body.bikeNumPlate
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Booking already exists for this date"
            });
        }

        // ✅ If no duplicate, create booking
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();

        // 🎯 Create slot notification for the user
        try {
            if (savedBooking.user_id && savedBooking.date) {
                // Determine service type for slot calculation
                let serviceType = "general"; // default
                if (savedBooking.bikeService === "All-Over Service") {
                    serviceType = "all-over";
                } else if (savedBooking.bikeService === "Customize Service") {
                    serviceType = "custom";
                }

                // Find available slot for this booking
                const bookingDate = new Date(savedBooking.date).toISOString().split('T')[0];
                await slotManager.initializeDate(bookingDate);
                const availableSlot = await slotManager.findAvailableSlot(bookingDate, serviceType);

                if (availableSlot) {
                    // Book the slot
                    const bookingResult = await slotManager.bookSlot(bookingDate, availableSlot, serviceType);
                    const reportingTime = bookingResult.notifyTime;

                    // Create notification
                    await createSlotBookingNotification(
                        savedBooking.user_id,
                        bookingResult.slotTime,
                        reportingTime,
                        bookingDate,
                        savedBooking.bikeService
                    );

                    console.log(`📱 Slot notification created for booking: ${savedBooking._id}`);
                    console.log(`🎯 Assigned to ${availableSlot.toUpperCase()} (${bookingResult.slotTime})`);
                    console.log(`🔔 Reporting time: ${reportingTime}`);
                } else {
                    console.log(`⚠️ No available slots for ${bookingDate}, notification not created`);
                }
            }
        } catch (notificationError) {
            console.error("❌ Failed to create slot notification:", notificationError);
            // Don't fail the booking if notification fails
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully!",
            data: savedBooking
        });

    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user_id", "fullName email contactNumber")
            .populate("mechanic_id", "fullName phone email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Create new contact
export const createContact = async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();

        res.status(201).json({
            success: true,
            message: "Contact submitted successfully!",
            data: savedContact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit contact",
            error: error.message,
        });
    }
};

// Get all contact messages (for admin)
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getUserBookings = async (req, res) => {
    try {
        const { id } = req.params; // logged in user id
        const bookings = await Booking.find({ user_id: id })
            .populate("mechanic_id", "fullName phone email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Update Booking
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Get the current booking to compare changes
        const currentBooking = await Booking.findById(id)
            .populate("mechanic_id", "fullName")
            .populate("user_id", "fullName firstName lastName");
        if (!currentBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const updated = await Booking.findByIdAndUpdate(id, updateData, { new: true })
            .populate("mechanic_id", "fullName")
            .populate("user_id", "fullName firstName lastName");

        // Send notifications based on what was updated
        try {
            // Check if mechanic was assigned (admin action)
            if (updateData.mechanic_id && !currentBooking.mechanic_id) {
                await createBookingNotification(
                    currentBooking.user_id._id,
                    "mechanic_assigned",
                    id,
                    updated.mechanic_id?.fullName
                );
            }

            // Check if status changed (admin action)
            if (updateData.status && updateData.status !== currentBooking.status) {
                let notificationType;
                switch (updateData.status) {
                    case "Confirmed":
                        notificationType = "booking_confirmed";
                        break;
                    case "In Progress":
                        notificationType = "booking_in_progress";
                        break;
                    case "Completed":
                        notificationType = "booking_completed";
                        break;
                }
                
                if (notificationType) {
                    await createBookingNotification(
                        currentBooking.user_id._id,
                        notificationType,
                        id
                    );
                }
            }

            // Send admin notification if user updated booking details (not status/mechanic changes)
            const userUpdatedFields = ['bikeCompany', 'bikeModel', 'bikeType', 'bikeNumPlate', 'bikeService', 'selectedServices', 'date', 'pickupDrop', 'pickupAddress', 'remarks'];
            const hasUserUpdates = userUpdatedFields.some(field => updateData.hasOwnProperty(field));
            
            if (hasUserUpdates) {
                const { createAdminBookingNotification } = await import("./notificationController.js");
                const userName = currentBooking.user_id?.fullName || 
                               `${currentBooking.user_id?.firstName || ''} ${currentBooking.user_id?.lastName || ''}`.trim() || 
                               'Customer';
                
                let updateType = "updated";
                if (updateData.status === "Cancelled") {
                    updateType = "cancelled";
                }
                
                await createAdminBookingNotification(
                    currentBooking.user_id._id,
                    userName,
                    id,
                    updateType
                );
            }
        } catch (notificationError) {
            console.error("Error sending notification:", notificationError);
            // Don't fail the booking update if notification fails
        }

        res.status(200).json({ success: true, message: "Booking updated successfully!", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Booking
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });

        res.status(200).json({ success: true, message: "Booking deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};





// Authentication middleware - works with user data sent from frontend
export const authenticate = async (req, res, next) => {
    try {
        // Get user_id from headers (set by axios interceptor)
        const user_id = req.headers['x-user-id'];
        
        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        // Create a simple user object with the ID
        req.user = { _id: user_id };
        return next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
};
// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        console.log('Starting dashboard stats fetch...');

        // Get basic counts without complex operations
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        
        // Import additional models
        const Mechanic = (await import("../model/mechanicModel.js")).default;
        const Order = (await import("../model/orderModel.js")).default;
        
        const mechanicCount = await Mechanic.countDocuments();
        const orderCount = await Order.countDocuments();

        console.log('Basic counts:', {
            users: userCount,
            bookings: bookingCount,
            mechanics: mechanicCount,
            orders: orderCount
        });

        // Simple statistics without filtering
        const stats = {
            totalUsers: userCount,
            totalBookings: bookingCount,
            totalMechanics: mechanicCount,
            totalOrders: orderCount,
            pendingBookings: 0,
            completedServices: 0,
            pendingOrders: 0,
            totalRevenue: 0
        };

        const revenueBreakdown = {
            today: 0,
            weekly: 0,
            monthly: 0
        };

        const recentActivity = [];

        const notifications = {
            newOrders: 0,
            cancelledOrders: 0,
            newBookings: 0
        };

        res.status(200).json({
            success: true,
            data: {
                stats,
                revenueBreakdown,
                recentActivity,
                notifications
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};