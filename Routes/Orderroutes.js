const { Order } = require('../Models/Order')
const express = require('express');
const route = express.Router();
require('dotenv/config');



// GET for cart
route.get('/', async (req, res) => {
    try {
        const filterkey= req.query.userid;
        if(filterkey!=undefined){
            const OrderList = await Order.find({userID:filterkey});
            if (!OrderList) {
                return res.status(404).json({ success: false, message: "Order not found." });
            }
            const totalItems = OrderList.length;
            return res.status(200).json(
                {
                    success:true,
                    OrderList:OrderList,
                    totalItems:totalItems
                });
        }
        const OrderList = await Order.find(req.query);
        if (!OrderList) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        return res.status(200).json({success:true,OrderList:OrderList});
    } catch (err) {
        res.status(500).json({ success: false, message: "Error Order Details", error: err.message });
    }
});

// POST ADD Product in Cart
route.post('/create', async (req, res) => {
    try {
        const {
            name,
            PaymentID,
            paymentType,
            amount,
            email,
            phoneNumber,
            products,
            address,
            pincode,
            userID
        } = req.body;


        // Add new Order
        const OrderList = new Order({
            name,
            PaymentID,
            paymentType,
            amount,
            email,
            phoneNumber,
            products,
            address,
            pincode,
            userID
        });

        const result = await OrderList.save();

        return res.status(200).json({
            success: true,
            message: "Order Placed..",
            data: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error While Placing Order",
            error: err.message,
        });
    }
});


module.exports = route;
