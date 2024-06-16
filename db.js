require('dotenv').config();

const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        const uri = process.env.MONGODB_URI; // Use the environment variable for the MongoDB URI
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDatabase;
