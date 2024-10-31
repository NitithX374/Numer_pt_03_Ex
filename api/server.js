const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS configuration
const allowedOrigins = ['https://numer-pt-03-ex.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Added allowed headers
}));
app.options('*', cors()); // Enable preflight for all routes

// Middleware
app.use(express.json());

// Connect to MongoDB with error handling and timeout configuration
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://chorunrit:j9W5rTM4haUuRYDm@cluster0.6p3he.mongodb.net/mynumerlog?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5-second timeout for MongoDB connection
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
    console.log(equation, method, result);
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

// Print repeating message to verify server is running
setInterval(() => {
    console.log('Server is active: 1 1 1 1 1 1 1 1');
}, 5000); // Logs every 5 seconds

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// {
//     "equation":
//     "x^2 - 4 = nigga"
//     "method":"Quadratic Formula"
//     "result":2}