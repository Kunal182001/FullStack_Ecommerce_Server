const mongoose= require('mongoose');

// Define Checkout Schema
const Cartschema = mongoose.Schema(
    {
        Fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phonenumber: {
            type: Number,
            required: true,
        },
        houseaddress: {
            type: String,
            required: true,
        },
        apartmentnumber: {
            type: String,
            default:"",
        },
        state: {
            type: String,
            required: true,
        },
        Town: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
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