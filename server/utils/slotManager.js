import SlotBooking from "../model/slotBookingModel.js";

// Slot definitions
const SLOTS = {
    slot1: { start: "09:00", end: "11:00", name: "9 AM - 11 AM" },
    slot2: { start: "11:00", end: "13:00", name: "11 AM - 1 PM" },
    slot3: { start: "16:00", end: "18:00", name: "4 PM - 6 PM" },
    slot4: { start: "18:00", end: "20:00", name: "6 PM - 8 PM" }
};

// Space required per service type
const SERVICE_TYPES = {
    "general": 1,
    "all-over": 2,
    "custom": 2
};

const MAX_CAPACITY = 6;

class SlotManager {

    // Get or create a date document in DB
    async initializeDate(date) {
        let record = await SlotBooking.findOne({ date });
        if (!record) {
            record = await SlotBooking.create({ date, slot1: 0, slot2: 0, slot3: 0, slot4: 0 });
            console.log(`📅 Initialized slots in DB for date: ${date}`);
        }
        return record;
    }

    // Find first available slot for the given date and service type
    async findAvailableSlot(date, serviceType) {
        const spaceRequired = SERVICE_TYPES[serviceType];
        const record = await this.initializeDate(date);

        console.log(`🔍 Checking slots for ${serviceType} service (requires ${spaceRequired} spaces)`);

        for (let i = 1; i <= 4; i++) {
            const slotKey = `slot${i}`;
            const currentLoad = record[slotKey];
            const available = MAX_CAPACITY - currentLoad;

            console.log(`   ${slotKey.toUpperCase()}: ${currentLoad}/${MAX_CAPACITY} used, ${available} available`);

            if (currentLoad + spaceRequired <= MAX_CAPACITY) {
                console.log(`✅ Found available slot: ${slotKey.toUpperCase()}`);
                return slotKey;
            }
        }

        console.log(`❌ No available slots for ${date}`);
        return null;
    }

    // Increment slot load in DB and return result
    async bookSlot(date, slotKey, serviceType) {
        const spaceRequired = SERVICE_TYPES[serviceType];

        const updated = await SlotBooking.findOneAndUpdate(
            { date },
            { $inc: { [slotKey]: spaceRequired } },
            { new: true }
        );

        console.log(`🎯 Booking assigned to ${slotKey.toUpperCase()} for ${date}`);
        console.log(`📊 Updated capacity: ${slotKey.toUpperCase()} now has ${updated[slotKey]}/${MAX_CAPACITY} spaces used`);

        const notifyTime = this.calculateNotificationTime(slotKey);

        return {
            slotKey,
            slotTime: SLOTS[slotKey].name,
            currentLoad: updated[slotKey],
            notifyTime
        };
    }

    // Calculate reporting time = 1 hour before slot start
    calculateNotificationTime(slotKey) {
        const slot = SLOTS[slotKey];
        const [hours, minutes] = slot.start.split(":");
        const notifyHour = parseInt(hours) - 1;
        const notifyTime = `${notifyHour.toString().padStart(2, "0")}:${minutes}`;

        console.log(`🔔 Notify user: Please bring your bike at ${notifyTime} for slot (${slot.name})`);
        return notifyTime;
    }

    // Get slot details for a date
    async getBookingsForDate(date) {
        const record = await this.initializeDate(date);
        return {
            date,
            slots: {
                slot1: record.slot1,
                slot2: record.slot2,
                slot3: record.slot3,
                slot4: record.slot4
            },
            slotsDetails: Object.keys(SLOTS).map(slotKey => ({
                slot: slotKey,
                time: SLOTS[slotKey].name,
                currentLoad: record[slotKey],
                availableSpace: MAX_CAPACITY - record[slotKey]
            }))
        };
    }

    // Get all slot records from DB
    async getAllBookings() {
        return await SlotBooking.find().sort({ date: 1 });
    }

    isValidServiceType(serviceType) {
        return SERVICE_TYPES.hasOwnProperty(serviceType);
    }

    getServiceTypes() {
        return SERVICE_TYPES;
    }

    getSlots() {
        return SLOTS;
    }
}

const slotManager = new SlotManager();
export default slotManager;
