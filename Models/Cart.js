const mongoose = require('mongoose');

// Define Cart Schema
const Cartschema = mongoose.Schema(
    {
        productTitle: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        size: {
            type: String,
           default:""
        },
        rating: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        sutotal: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
        userID: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create and export the Category model
exports.Cart = mongoose.model('Cart', Cartschema);
