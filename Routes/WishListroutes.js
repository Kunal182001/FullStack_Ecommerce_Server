const { Wishlist } = require('../Models/WishList')
const express = require('express');
const route = express.Router();
require('dotenv/config');


// GET for WishList
route.get('/', async (req, res) => {
    try {
        const filterkey = req.query.userid;
        if (filterkey != undefined) {
            const WishList = await Wishlist.find({ userID: filterkey });
            if (!WishList) {
                return res.status(404).json({ success: false, message: "WishList not found." });
            }
            const totalItems = WishList.length;
            return res.status(200).json(
                {
                    success: true,
                    WishList: WishList,
                    totalItems: totalItems
                });
        }
        const WishList = await Wishlist.find(req.query);
        if (!WishList) {
            return res.status(404).json({ success: false, message: "WishList not found." });
        }
        return res.status(200).json({ success: true, WishList: WishList });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching WishList", error: err.message });
    }
});

// POST ADD Product in WishList
route.post('/add', async (req, res) => {
    try {
        const {
            productTitle,
            image,
            size,
            rating,
            oldprice,
            newPrice,
            disCount,
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

        // Check if the product is already in the WishList
        const WishListProduct = await Wishlist.findOne({ productId: productId, userID: userID });

        if (WishListProduct) {
            return res.status(201).json({
                success: false,
                message: "Product already added in WishList"
            });
        }

        // Add new product to cart
        const WishList = new Wishlist({
            productTitle,
            image,
            size,
            rating,
            oldprice,
            newPrice,
            disCount,
            sutotal,
            quantity,
            productId,
            userID,
        });

        const result = await WishList.save();

        return res.status(200).json({
            success: true,
            message: "Product added to WishList successfully",
            data: result
        });

    } catch (err) {
        console.error("Error Adding Product to WishList:", err.message);
        res.status(500).json({
            success: false,
            message: "Error Adding Product to WishList",
            error: err.message,
        });
    }
});

// DELETE WishList by ID
route.delete('/:id', async (req, res) => {
    try {
        
        const DeletedWishListItem = await Wishlist.findByIdAndDelete(req.params.id);
        if (!DeletedWishListItem) {
            return res.status(404).json({
                success: false,
                message: "WishList Item not found or already deleted.",
            });
        }
        res.status(200).json({ success: true, message: "WishList Product Remove successfully." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error While Removing WishList Item",
            error: err.message,
        });
    }
});
// DELETE WishList product by ID
route.delete('/product/:id', async (req, res) => {
    try {
        const wishlistItem = await Wishlist.findOne({ productId: req.params.id });
        
            if(!wishlistItem){
                return res.status(404).json({
                    success: false,
                    message: "WishList Item not found in WishList or already deleted.",
                });
            }
            const DeletedWishListItem = await Wishlist.findByIdAndDelete(wishlistItem._id);
            if (!DeletedWishListItem) {
                return res.status(404).json({
                    success: false,
                    message: "WishList Item not found or already deleted.",
                });
            }
            return res.status(200).json({ success: true, message: "WishList Product Remove successfully." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error While Removing WishList Item",
            error: err.message,
        });
    }
});

module.exports = route;