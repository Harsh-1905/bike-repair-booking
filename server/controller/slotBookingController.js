import slotManager from "../utils/slotManager.js";
import { createSlotBookingNotification } from "./notificationController.js";

// Book a slot
export const bookSlot = async (req, res) => {
    try {
        const { date, serviceType, userId } = req.body;

        console.log(`\n🚀 New booking request received:`);
        console.log(`   Date: ${date}`);
        console.log(`   Service Type: ${serviceType}`);
        console.log(`   User ID: ${userId}`);

        if (!date || !serviceType) {
            return res.status(400).json({ success: false, message: "Date and serviceType are required" });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ success: false, message: "Date must be in YYYY-MM-DD format" });
        }

        if (!slotManager.isValidServiceType(serviceType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid service type. Valid types: ${Object.keys(slotManager.getServiceTypes()).join(", ")}`
            });
        }

        // Find available slot (DB-backed)
        const availableSlot = await slotManager.findAvailableSlot(date, serviceType);

        if (!availableSlot) {
            return res.status(400).json({
                success: false,
                message: "All slots are full for this date",
                availableSlots: await slotManager.getBookingsForDate(date)
            });
        }

        // Book the slot in DB
        const bookingResult = await slotManager.bookSlot(date, availableSlot, serviceType);
        const reportingTime = bookingResult.notifyTime;

        // Create notification for user
        if (userId) {
            try {
                await createSlotBookingNotification(userId, bookingResult.slotTime, reportingTime, date, serviceType);
                console.log(`📱 Notification created for user: ${userId}`);
            } catch (notificationError) {
                console.error(`❌ Failed to create notification:`, notificationError);
            }
        }

        console.log(`✅ Booking successful!`);
        console.log(`─────────────────────────────────────────\n`);

        res.status(200).json({
            success: true,
            message: "Booking confirmed successfully",
            data: {
                date,
                serviceType,
                assignedSlot: availableSlot,
                slotTime: bookingResult.slotTime,
                reportingTime,
                currentLoad: bookingResult.currentLoad,
                maxCapacity: 6
            }
        });

    } catch (error) {
        console.error("❌ Booking error:", error);
        res.status(500).json({ success: false, message: "Server error occurred while processing booking" });
    }
};

// Get available slots for a specific date
export const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.params;
        if (!date) {
            return res.status(400).json({ success: false, message: "Date parameter is required" });
        }
        const bookingsData = await slotManager.getBookingsForDate(date);
        res.status(200).json({ success: true, message: "Slots retrieved successfully", data: bookingsData });
    } catch (error) {
        console.error("Error getting slots:", error);
        res.status(500).json({ success: false, message: "Server error occurred while retrieving slots" });
    }
};

// Get all bookings (admin/debug)
export const getAllBookings = async (req, res) => {
    try {
        const allBookings = await slotManager.getAllBookings();
        res.status(200).json({ success: true, message: "All bookings retrieved successfully", data: allBookings });
    } catch (error) {
        console.error("Error getting all bookings:", error);
        res.status(500).json({ success: false, message: "Server error occurred while retrieving bookings" });
    }
};

// Get service types and slot info
export const getBookingInfo = async (req, res) => {
    try {
        const serviceTypes = slotManager.getServiceTypes();
        const slots = slotManager.getSlots();
        res.status(200).json({
            success: true,
            message: "Booking information retrieved successfully",
            data: {
                serviceTypes: Object.keys(serviceTypes).map(type => ({
                    name: type,
                    spaceRequired: serviceTypes[type]
                })),
                slots: Object.keys(slots).map(slotKey => ({
                    slot: slotKey,
                    time: slots[slotKey].name,
                    start: slots[slotKey].start,
                    end: slots[slotKey].end
                })),
                maxCapacityPerSlot: 6
            }
        });
    } catch (error) {
        console.error("Error getting booking info:", error);
        res.status(500).json({ success: false, message: "Server error occurred while retrieving booking information" });
    }
};
