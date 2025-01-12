const {Category}=require('../Models/Category.js')
const express = require('express');
const route = express.Router();
const pLimit = require('p-limit');
const cloudinary = require('cloudinary').v2;
require('dotenv/config');

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// GET all categories
route.get('/', async (req, res) => {
    try {

        const all = req.query.all === 'true';
        if (all) {
            const Categoreylist = await Category.find(); // Fetch all categories
            return res.status(200).json({ Categoreylist });
        }
        const filterKey=req.query.cat;
        if(filterKey!=undefined){
            let query={}
            if(filterKey == 'Electronics'){
                query.name = "Electronics"
            }
            else if(filterKey == 'Fashion'){
                query.name = 'Fashion'
            }
            else if(filterKey == 'Footwear'){
                query.name = 'Footwear'
            }
            else if(filterKey == 'Bags'){
                query.name = 'Bags'
            }
            else if(filterKey == 'Beauty'){
                query.name = 'Beauty'
            }
            else if(filterKey == 'Groceries'){
                query.name = 'Groceries'
            }
            else if(filterKey == 'Jewellery'){
                query.name = 'Jewellery'
            }
            else if(filterKey == 'Appliances'){
                query.name = 'Appliances'
            }
            const filtercat=await Category.find(query);
            if (!filtercat) {
                return res.status(404).json({ success: false, message: "No categories found." });
            }
            return res.status(200).json({ filtercat });
        }

        const page=parseInt(req.query.page)||1;
        const perpage=5;
        const totalposts=await Category.countDocuments();
        const totalpage=Math.ceil(totalposts/perpage);
        if(page>totalpage){
            return res.status(404).json({message:"Page Not Found"});
        }
        const Categoreylist = await Category.find()
            .skip((page-1)*perpage)
            .limit(perpage)
            .exec();
        if (!Categoreylist) {
            return res.status(404).json({ success: false, message: "No categories found." });
        }
        return res.status(200).json({
            "Categoreylist":Categoreylist,
            "totalpage":totalpage,
            "page":page});
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching categories", error: err.message });
    }
});

// POST create category
route.post('/create', async (req, res) => {
    const limit = pLimit(2);
    const imagetoupload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    try {
        const uploadstatus = await Promise.all(imagetoupload);
        const imgurl = uploadstatus.map((item) => item.secure_url);
        let category = new Category({
            name: req.body.name,
            subcat: req.body.subcat,
            images: imgurl,
            color: req.body.color,
        });

        category = await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: err.message,
        });
    }
});

// GET category by ID
route.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found." });
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error: err.message,
        });
    }
});

// DELETE category by ID
route.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found or already deleted.",
            });
        }
        res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: err.message,
        });
    }
});

// PUT update category by ID
route.put('/:id', async (req, res) => {
    const limit = pLimit(2);
    const imagetoupload = req.body.images.map((image) => {
        return limit(async () => {
            const result = await cloudinary.uploader.upload(image);
            return result;
        });
    });

    try {
        const uploadstatus = await Promise.all(imagetoupload);
        const imgurl = uploadstatus.map((item) => item.secure_url);

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                subcat: req.body.subcat,
                images: imgurl,
                color: req.body.color,
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found for updating.",
            });
        }

        res.status(200).json(updatedCategory);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: err.message,
        });
    }
});

module.exports = route;
