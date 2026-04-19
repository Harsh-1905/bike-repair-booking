import mongoose from "mongoose";

// Custom Service Schema (for customize service option)
const customServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Service Package Schema (for main service types)
const servicePackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
customServiceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

servicePackageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export const CustomService = mongoose.model("CustomService", customServiceSchema);
export const ServicePackage = mongoose.model("ServicePackage", servicePackageSchema);