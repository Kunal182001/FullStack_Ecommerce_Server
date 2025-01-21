const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNum: {
            type: Number,
            unique:true,
            sparse: true,
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        password: {
            type: String,
        },
        isVerified:{
            type:String,
            default:false
        },
        otp:{
            type:String,
        },
        otpExipers:{
            type:Date
        },
        date:{
            type:Date,
            default:Date.now
        }

    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
)

exports.User = mongoose.model('User', userSchema);
