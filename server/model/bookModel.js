import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registration",
        required: true
    },

    bikeCompany: {
        type: String,
        required: true,
        trim: true
    },

    bikeModel: {
        type: String,
        required: true,
        trim: true
    },

    bikeType: {
        type: String,
        enum: ["Bike", "Moped"],
        required: true
    },

    bikeNumPlate: {
        type: String,
        required: true,
        uppercase: true
    },

    bikeService: {
        type: String,
        enum: ["General Service", "All-Over Service", "Customize Service"],
        required: true
    },

    // for customize service
    selectedServices: {
        type: [String],
        default: []
    },

    price: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    pickupDrop: {
        type: String,
        enum: ["yes", "no"],
        default: "no"
    },

    pickupAddress: {
        type: String,
        default: ""
    },

    remarks: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "In Progress",
            "Completed",
            "Cancelled"
        ],
        default: "Pending"
    }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);