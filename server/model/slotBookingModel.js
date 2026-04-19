import mongoose from "mongoose";

// Stores slot load per date — one document per date
const slotBookingSchema = new mongoose.Schema({
    date: {
        type: String, // "YYYY-MM-DD"
        required: true,
        unique: true
    },
    slot1: { type: Number, default: 0 },
    slot2: { type: Number, default: 0 },
    slot3: { type: Number, default: 0 },
    slot4: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const SlotBooking = mongoose.model("SlotBooking", slotBookingSchema);
export default SlotBooking;
