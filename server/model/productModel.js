import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        oldPrice: {
            type: Number,
            default: 0
        },

        rating: {
            type: Number,
            default: 0
        },

        category: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        }

    },
    { timestamps: true }
);

export default mongoose.model("product", productSchema);