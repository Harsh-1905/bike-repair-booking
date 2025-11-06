import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "registration", required: true }, // 👈 ref updated
    bike_name: { type: String, required: true },
    bike_company: { type: String, required: true },
    bike_model: { type: String, required: true },
    bike_type: { type: String, required: true },
    bike_numplate: { type: String, required: true },
    bike_services: { type: String, required: true, default: "General Service" },
    date_time: { type: Date, required: true },
    remarks: { type: String, default: "" },
    status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema); // explicitly set collection name
