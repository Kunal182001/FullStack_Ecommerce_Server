const mongoose = require('mongoose');
require('dotenv/config');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MongoDB_URI); // No need for options in recent versions
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
