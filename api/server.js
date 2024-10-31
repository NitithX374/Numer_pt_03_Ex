const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: 'https://numer-pt-03-ex.vercel.app', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));
// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://chorunrit:j9W5rTM4haUuRYDm@cluster0.6p3he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

// Call connectDB once when the server starts
connectDB();

// Define Calculation schema and model
const calculationSchema = new mongoose.Schema({
    equation: String,
    method: String,
    result: Number
});

const Calculation = mongoose.model('Calculation', calculationSchema); // Use a singular name for the model

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: "Test API is working" });
});

// Home endpoint
app.get('/', (req, res) => {
    res.json({ message: "API is working" });
});

// Insert calculation
app.post('/api/insert', async (req, res) => {
    const { equation, method, result } = req.body;

    try {
        const calculation = new Calculation({ equation, method, result });
        await calculation.save();
        res.json({ msg: "Data inserted successfully", data: calculation });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;


//MongoAcc:chorunrit MongoPass:j9W5rTM4haUuRYDm
//mongodb+srv://chorunrit:<db_password>@cluster0.6p3he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0