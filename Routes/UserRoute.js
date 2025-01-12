const express = require('express');
const route = express.Router();
const { User } = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../Helper/emailservies');

require('dotenv/config');


//SignUp
route.post('/signup', async (req, res) => {
    const { name, phoneNum, email, password } = req.body;
    try {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let user;
        const existingUser = await User.findOne({ email: email });
        const existingUserbyPhone = await User.findOne({ phoneNum: phoneNum });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Email already Exist!"
            })
        }
        if (existingUserbyPhone) {
            return res.status(400).json({
                success: false,
                message: "User Phone Number already Exist!"
            })
        }
        if (existingUser) {
            const hashpassword = await bcrypt.hash(password, 10);
            existingUser.password = hashpassword,
                existingUser.otp = verifyCode;
            existingUser.otpExipers = Date.now() + 600000;
            await existingUser.save();
            user = existingUser;
        }
        else {

            const hashpassword = await bcrypt.hash(password, 10);
            user = await User.create({
                name: name,
                phoneNum: phoneNum,
                email: email,
                password: hashpassword,
                otp: verifyCode,
                otpExipers: Date.now() + 600000

            })
            await user.save();
        }
        const emailres = sendEmailtoVerify(email, "Verify Email", "", "Your OTP is " + verifyCode);
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_WEB_TOKEN);
        res.status(200).json({
            success:true,
            msg:"User registered successfully! Now Please Verify Your Email",
            token: token
        })

    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error while Creating User", error: err.message });
    }
})

const sendEmailtoVerify= async(to,subject,text,html)=>{
    const result= await sendEmail(to,subject,text,html);
    if(result.success){
        return true;
    }
    else{
        return false;
    }
}

//VerifyMail
route.post('/verifyemail' ,async(req,res)=>{
    try{
        const{email, otp}=req.body;
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: "User not found"
            })
        }
        const isCodeVaild = user.otp === otp;
        const isNotexpired = user.otpExipers > Date.now();
        if(isCodeVaild&&isNotexpired){
            user.isVerified = true;
            user.otp = null;
            user.otpExipers = null;
            await user.save();
            return res.status(200).json({
                success:true,
                msg:"User registered successfully! Now Please Verify Your Email",
            })
        }
        else if(!isCodeVaild){
            return res.status(400).json({
                success:false,
                msg:"Invaild OTP"
            })
        }
        else{
            return res.status(200).json({
                success:false,
                msg:"OTP Expired",
            })
        }

    }
    catch(err){
        return res.status(500).json({ success: false, message: "Error while Verifying OTP", error: err.message });
    }
})
//SignIn
route.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Not found"
            })
        }
        if(existingUser.isVerified === false){
            return res.status(400).json({
                success: false,
                message: "Your Email is Not verified first please verified Your Email or Make a New Account"
            })
        }
        const matchpass = await bcrypt.compare(password, existingUser.password);
        if (!matchpass) {
            return res.status(400).json({
                success: false,
                message: "Password not Match"
            });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_WEB_TOKEN);
        const result = existingUser;
        res.status(200).json({
            result: result,
            token: token
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error while Fetching User", error: err.message });
    }
})

//SignIn with google
route.post('/auth', async (req, res) => {
    const { name, phoneNum, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_WEB_TOKEN);
            return res.status(200).json({
                result: existingUser,
                token: token
            }); // Stop further execution here
        }

        // Create a new user if not found
        const result = await User.create({
            name: name,
            phoneNum: phoneNum,
            email: email,
            password: password
        });
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_WEB_TOKEN);
        return res.status(200).json({
            result: result,
            token: token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while Fetching User",
            error: err.message
        });
    }
});



// Get all User
route.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(400).json({
                success: false,
                message: "Error while Fetching All Users"
            })
        }
        return res.status(200).json({
            userList: users
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Error while Fetching The Users", error: err.message });
    }
})

//Get by ID
route.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Error while Fetching The Users"
            })
        }
        res.status(200).json({
            success:true,
            user: user
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error while Fetching The User", error: err.message });
    }
})

//Delete the User
route.delete('/:id', async (req, res) => {
    try {
        const deleteduser = await User.findByIdAndDelete(req.params.id);
        if (!deleteduser) {
            return res.status(400).json({
                success: false,
                message: "User not found or already deleted.",
            });
        }
        res.status(200).json({ success: true, message: "User deleted successfully." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error while Deleting The User", error: err.message });
    }

})

// Edit or updating the User
route.put('/:id', async (req, res) => {
    const { name, phoneNum, email, password } = req.body;
    try {
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(400).json({
                message: "User Not Found"
            })
        }
        let newpassword;
        if (req.body.password) {
            newpassword = await bcrypt.hash(req.body.password, 10);
        }
        else {
            newpassword = existingUser.password
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phoneNum: phoneNum,
                email: email,
                password: newpassword
            },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Cannot be Updated..."
            })
        }
        res.status(200).json({
            success:true,
            result: user
        })
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error while Updating The User", error: err.message });
    }
})
module.exports = route;