const { Product } = require('../Models/Product');
const express = require('express');
const route = express.Router();
require('dotenv/config');


route.get('/', async (req, res) => {
    try {
        // 🌟 Extract Query Parameters
        const query = req.query.s?.trim().toLowerCase(); // Search Query
        const filterMin = req.query.min; // Minimum Price
        const filterMax = req.query.max; // Maximum Price
        const filterRating = req.query.rat; // Rating
        
        let searchTerms = [];
        let finalQuery = {}; // MongoDB Query Object

        // 🌟 1. SEARCH LOGIC
        if (query) {
            const keywordMapping = {
                fashion: ['fashion', 'clothes', 'apparel', 'outfit', 'attire'],
                men: ['men', 'male', 'man', 'gentleman'],
                women: ['women', 'female', 'woman', 'lady'],
                boy: ['boy', 'boys', 'kid', 'child'],
                girl: ['girl', 'girls', 'kid', 'child'],
                electronics: ['electronics', 'gadgets', 'devices'],
                mobiles: ['mobile', 'mobiles', 'smartphone', 'phone'],
                laptops: ['laptop', 'laptops', 'notebook'],
                smartwatch: ['smartwatch', 'watch', 'wearable'],
                shoes: ['footwear', 'shoes', 'shoe', 'sneakers', 'boots', 'sandals'],
                bags: ['bags', 'handbag', 'backpack', 'purse'],
                beauty: ['beauty', 'skincare', 'cosmetics', 'makeup'],
                groceries: ['groceries', 'food', 'produce', 'supplies'],
                jewelry: ['jewelry', 'jewellery', 'necklace', 'ring', 'bracelet'],
                appliances: ['appliances', 'home appliances', 'kitchen appliances', 'electronics']
            };

            searchTerms = [query];
            for (const [key, synonyms] of Object.entries(keywordMapping)) {
                if (synonyms.includes(query)) {
                    searchTerms = synonyms;
                    break;
                }
            }

            const singularToPlural = (word) => {
                if (word.endsWith('s')) return word.slice(0, -1);
                return `${word}s`;
            };
            searchTerms.push(singularToPlural(query));

            finalQuery.$or = searchTerms.map(term => ({
                $or: [
                    { name: { $regex: `.*${term}.*`, $options: 'i' } },
                    { brand: { $regex: `.*${term}.*`, $options: 'i' } },
                    { description: { $regex: `.*${term}.*`, $options: 'i' } },
                    { subCat: { $regex: `.*${term}.*`, $options: 'i' } }
                ]
            }));
        }

        // 🌟 2. PRICE RANGE FILTER
        if (filterMin && filterMax) {
            finalQuery.newPrice = { $gte: parseInt(filterMin), $lte: parseInt(filterMax) };
        } else if (filterMin) {
            finalQuery.newPrice = { $gte: parseInt(filterMin) };
        } else if (filterMax) {
            finalQuery.newPrice = { $lte: parseInt(filterMax) };
        }

        // 🌟 3. RATING FILTER
        if (filterRating && filterRating > 0 && filterRating <= 5) {
            finalQuery.rating = filterRating;
        }

        // 🌟 4. DATABASE QUERY
        const  searchItems= await Product.find(finalQuery).populate('category');

        res.status(200).json({
            status: true,
            searchItems:searchItems
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while Searching/Filtering the Product",
            error: err.message
        });
    }
});




module.exports = route;