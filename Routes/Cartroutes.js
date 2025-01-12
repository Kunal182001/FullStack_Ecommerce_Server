const { Cart } = require('../Models/Cart.js')
const express = require('express');
const route = express.Router();
require('dotenv/config');



// GET for cart
route.get('/', async (req, res) => {
    try {
        const filterkey= req.query.userid;
        if(filterkey!=undefined){
            const cartList = await Cart.find({userID:filterkey});
            if (!cartList) {
                return res.status(404).json({ success: false, message: "CartList not found." });
            }
            const totalItems = cartList.length;
            return res.status(200).json(
                {
                    success:true,
                    cartList:cartList,
                    totalItems:totalItems
                });
        }
        const cartList = await Cart.find(req.query);
        if (!cartList) {
            return res.status(404).json({ success: false, message: "CartList not found." });
        }
        return res.status(200).json({success:true,cartList:cartList});
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching Cart", error: err.message });
    }
});

// POST ADD Product in Cart
route.post('/add', async (req, res) => {
    try {
        const {
            productTitle,
            image,
            size,
            rating,
            price,
            sutotal,
            quantity,
            productId,
            userID
        } = req.body;

        // Validate Required Fields
        if (!productId || !userID) {
            return res.status(400).json({
                success: false,
                message: "Product ID and User ID are required"
            });
        }

        // Check if the product is already in the cart
        const cartproduct = await Cart.findOne({ productId: productId, userID: userID });

        if (cartproduct) {
            return res.status(201).json({
                success: false,
                message: "Product already added in Cart"
            });
        }

        // Add new product to cart
        const cartList = new Cart({
            productTitle,
            image,
            size,
            rating,
            price,
            sutotal,
            quantity,
            productId,
            userID,
        });

        const result = await cartList.save();

        return res.status(200).json({
            success: true,
            message: "Product added to Cart successfully",
            data: result
        });

    } catch (err) {
        console.error("Error Adding Product to Cart:", err.message);
        res.status(500).json({
            success: false,
            message: "Error Adding Product to Cart",
            error: err.message,
        });
    }
});


// DELETE Cart Product by ID
route.delete('/:id', async (req, res) => {
    try {
        const DeletedCartItem = await Cart.findByIdAndDelete(req.params.id);
        if (!DeletedCartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart Item not found or already deleted.",
            });
        }
        res.status(200).json({ success: true, message: "Cart Product Remove successfully." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error While Removing Cart Item",
            error: err.message,
        });
    }
});

// PUT update category by ID
route.put('/:id', async (req, res) => {
    try {
        const {price,quantity} = req.body;
        const updateditem = await Cart.find({_id:req.params.id});
        if (!updateditem) {
            return res.status(404).json({
                success: false,
                message: "Cart Item not found for updating.",
            });
        }
        const newSubtotal= updateditem[0].price*quantity;
        const CartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                image: req.body.image,
                size:req.body.size,
                rating: req.body.rating,
                price: req.body.price,
                sutotal: newSubtotal,
                quantity: req.body.quantity,
                productId: req.body.productId,
                userID: req.body.userID,
            },
            { new: true }
        );
        if (!CartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart Item not found for updating.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart Updated successfully",
            data: CartItem
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error While updating Cart Item",
            error: err.message,
        });
    }
});

module.exports = route;
