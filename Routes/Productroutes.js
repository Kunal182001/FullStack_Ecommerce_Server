const { disconnect } = require('mongoose');
const { Category } = require('../Models/Category');
const { Product } = require('../Models/Product');
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


route.get('/', async (req, res) => {
    try {

        const all = req.query.all === 'true';
        if (all) {

            const allproductlist = await Product.find().populate('category'); // Fetch all Products
            return res.status(200).json({ allproductlist });
        }

        const filterKey = req.query.product;
        const filterMin = req.query.min;
        const filterMax = req.query.max;
        const filterrating = req.query.rat;
        let query = {};
        if (filterKey != undefined) {
            if (filterKey === "Featured") {
                query.isFeatured = true;
            }
            else if (filterKey == "New") {

                query.isnewarrival = true;
            }
            else if (filterKey == "Popular") {
                query.ispopproduct = true;
            }
            else if (filterKey == 'Electronics') {
                query.category = "675e92b058cb0041f83786a1"
            }
            else if (filterKey == 'Fashion') {

                query.category = "675e910a58cb0041f8378699"
            }
            else if (filterKey == 'Footwear') {
                query.category = '675e94bc58cb0041f83786a9'
            }
            else if (filterKey == 'Bags') {
                query.category = '675e98d558cb0041f83786b5'
            }
            else if (filterKey == 'Beauty') {
                query.category = '675e997658cb0041f83786b9'
            }
            else if (filterKey == 'Groceries') {
                query.category = '675e9a2558cb0041f83786c1'
            }
            else if (filterKey == 'Jewellery') {
                query.category = '675e9ac958cb0041f83786cb'
            }
            else if (filterKey == '675ea18fc9e36f5d03a5808b') {
                query.category = 'Appliances'
            }
            else {
                query.subcat = filterKey;
            }


            if (filterMin && filterMax) {
                query.newPrice = {
                    $gte: parseInt(filterMin),
                    $lte: parseInt(filterMax)
                };
            } else if (filterMin) {
                query.newPrice = { $gte: parseInt(filterMin) };
            } else if (filterMax) {
                query.newPrice = { $lte: parseInt(filterMax) };
            }

            if(filterrating!=0 && filterrating<=5){
                query.rating = filterrating;
            }


            const filterProduct = await Product.find(query).populate('category');
            return res.status(200).json({ filterProduct });
        }
        const page = parseInt(req.query.page) || 1;
        const perpage = 5;
        const totalposts = await Product.countDocuments();
        const totalpage = Math.ceil(totalposts / perpage);

        if (page > totalpage) {
            return res.status(404).json({ message: "Page Not Found" });
        }

        const ProductList = await Product.find().populate('category')
            .skip((page - 1) * perpage)
            .limit(perpage)
            .exec();
        if (!ProductList) {
            return res.status(404).json({ success: false, message: 'No products found' });
        }
        res.status(200).json({
            "ProductList": ProductList,
            "totalpage": totalpage,
            "page": page
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

route.post('/create', async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Invalid Category' });
        }

        const limit = pLimit(2);
        const imagetoupload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });
        const uploadstatus = await Promise.all(imagetoupload);
        if (!uploadstatus) {
            return res.status(404).json({ success: false, message: 'Invalid Images' });
        }
        const imgurl = uploadstatus.map((item) => item.secure_url);

        let product = new Product({
            name: req.body.name,
            discription: req.body.discription,
            techData: req.body.techData || {},
            images: imgurl,
            brand: req.body.brand,
            oldprice: req.body.oldprice || 0,
            newPrice: req.body.newPrice || 0,
            disCount: req.body.disCount || 0,
            category: req.body.category,
            subcat: req.body.subcat,
            countInstock: req.body.countInstock || 0,
            rating: req.body.rating || 0,
            Numreview: req.body.Numreview || 0,
            isFeatured: req.body.isFeatured || false,
            isnewarrival: req.body.isnewarrival || false,
            ispopproduct: req.body.ispopproduct || false,
        });


        if (!product) {
            return res.status(404).json({ success: false, message: 'Invaild Product' });
        }
        product = await product.save();
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
})

// DELETE Product by ID
route.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found or already deleted.",
            });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting Product",
            error: err.message,
        });
    }
});

// GET Product by ID
route.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: err.message,
        });
    }
});

// PUT update Product by ID
route.put('/:id', async (req, res) => {
    try {
        const limit = pLimit(2);
        const imagetoupload = req.body.images.map((image) => {
            return limit(async () => {
                const result = await cloudinary.uploader.upload(image);
                return result;
            });
        });
        const uploadstatus = await Promise.all(imagetoupload);
        if (!uploadstatus) {
            return res.status(404).json({ success: false, message: 'Invalid Images' });
        }
        const imgurl = uploadstatus.map((item) => item.secure_url);

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                discription: req.body.discription,
                techData: req.body.techData,
                images: imgurl,
                brand: req.body.brand,
                oldprice: req.body.oldprice,
                newPrice: req.body.newPrice,
                disCount: req.body.disCount,
                category: req.body.category,
                subcat: req.body.subcat,
                countInstock: req.body.countInstock,
                rating: req.body.rating,
                isFeatured: req.body.isFeatured,
                isnewarrival: req.body.isnewarrival,
                ispopproduct: req.body.ispopproduct,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found for updating.",
            });
        }

        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: err.message,
        });
    }
});



module.exports = route;