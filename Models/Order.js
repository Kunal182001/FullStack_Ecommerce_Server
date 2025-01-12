const mongoose= require('mongoose');

// Define Checkout Schema
const orderSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        PaymentID: {
            type: String,
            required: true,
        },
        paymentType:{
            type:String,
            required:true,
        },
        amount:{
            type:Number,
            required:true,
        },
        date:{
            type: Date,
            default: Date.now,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        products:[
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
            }
            
        ],
        address: {
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
exports.Order = mongoose.model('Order', orderSchema);