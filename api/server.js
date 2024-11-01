const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// CORS configuration
app.use(cors({
    origin: [
        '*'
        // 'http://localhost:5173',
        // 'https://numer-pt-03-ex-w2tr.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware for parsing JSON
app.use(express.json());

// MongoDB connection
const connectionString = 'mongodb+srv://chorunrit:XbiNSZ7nGKxEUuIg@cluster0.6p3he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5-second timeout for MongoDB connection
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit the process if the DB connection fails
    }
};

// Call connectDB once when the server starts
connectDB();

// Define Calculation schema and model
const calculated = new mongoose.Schema({
    equation: { type: String, required: true },
    method: { type: String, required: true },
    result: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now } // Optionally track when the entry was created
});

const Calculation = mongoose.model('calculation_logger', calculated); // Updated model name for clarity

// Home endpoint
app.get('/', (req, res) => {
    res.json({ message: "API is working" });
});

// Insert calculation
app.post('/api/insert', async (req, res) => {
    const { equation, method, result } = req.body;

    console.log(equation, method, result); // Log for debugging
    // res.status(201).send("API Insert working")
    try {
        
        const calculation = await new Calculation({ equation, method, result }).save();

        // Respond with the created calculation
        res.status(201).json({ msg: "Data inserted successfully", data: calculation });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server only if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; // Export app for testing or further use
