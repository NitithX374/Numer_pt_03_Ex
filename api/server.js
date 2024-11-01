const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port

// CORS configuration
const allowedOrigins = ['https://numer-pt-03-ex-ogf5.vercel.app', 'http://localhost:3000'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors()); // Enable preflight for all routes

// Middleware
app.use(express.json());

// MongoDB connection
const connectionString = 'mongodb+srv://chorunrit:<your-password>@cluster0.6p3he.mongodb.net/mynumer_log?retryWrites=true&w=majority&appName=Cluster0';
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

const Calculation = mongoose.model('calculation_logs', calculated); // Updated model name for clarity

// Home endpoint
app.get('/', (req, res) => {
    res.json({ message: "API is working" });
});

// Insert calculation
app.post('/api/insert', async (req, res) => {
    const { equation, method, result } = req.body;

    console.log(equation, method, result); // Log for debugging

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

// Start the server only if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; // Export app for testing or further use
