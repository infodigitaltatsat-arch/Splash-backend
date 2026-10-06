const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,

        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        subCategory: {
            type: String,
            default: "",
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        originalPrice: {
            type: Number,
            default: null,
        },
        unit: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product",productSchema);

module.exports = Product;