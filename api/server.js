const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://numer-pt-03-ex.vercel.app/bisection', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://chorunrit:j9W5rTM4haUuRYDm@cluster0.6p3he.mongodb.net/mynumerlog?retryWrites=true&w=majority&appName=Cluster0', {
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
const calculation_logsSchema = new mongoose.Schema({
    equation: String,
    method: String,
    result: Number
});

const Calculation = mongoose.model('calculation_logs', calculation_logsSchema);

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
        // Validate input and return early if invalid
        if (!equation || !method || result === undefined) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Create and save calculation in one step
        const calculation = await new Calculation({ equation, method, result }).save();

        // Respond with the created calculation
        res.status(201).json({ msg: "Data inserted successfully", data: calculation });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = app;
