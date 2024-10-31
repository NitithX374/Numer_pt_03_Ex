const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Assuming you use mongoose for MongoDB
require('dotenv').config();

const app = express();

// Initialize database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Don't exit process in serverless environment
    }
};

// Middleware setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Connect to the database
connectDB();

// Health check endpoint
app.get('/', async (req, res) => {
    try {
        res.json({ 
            message: "Numer Option API is running",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Main calculation logic (simulating your original controller logic)
const mainCalculation = {
    _createTable: async (req, res) => {
        const { equation, method, result } = req.body;
        
        // Assuming you have a Calculation model
        const Calculation = mongoose.model('calculation_logs', new mongoose.Schema({
            equation: String,
            method: String,
            result: String,
        }));

        try {
            const newCalculation = new Calculation({ equation, method, result });
            await newCalculation.save();
            res.status(201).json({ message: "Calculation saved successfully", data: newCalculation });
        } catch (error) {
            console.error('Error saving calculation:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    _getData: async (req, res) => {
        try {
            const Calculation = mongoose.model('calculation_logs');
            const calculations = await Calculation.find();
            res.json(calculations);
        } catch (error) {
            console.error('Error retrieving data:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

// Routes
app.post('/api/calculate', mainCalculation._createTable);
app.get('/api/calculate', mainCalculation._getData);

// Start server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; // Export for testing or further integration



// const express = require('express');
// const { MongoClient } = require('mongodb');
// const cors = require('cors');
// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(cors());

// // MongoDB connection URI
// const uri = process.env.MONGODB_URI;

// // MongoDB client and database variable
// let db;

// // Connect to MongoDB
// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     db = client.db(); // Get the database
//     console.log('Connected to MongoDB');
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });

// app.use((req, res, next) => {
//     console.log(`Received ${req.method} request to ${req.url}`);
//     next();
// });

// app.get('/api/test', (req, res) => {
//     try {
//         res.json({ message: "test API is working" });
//     } catch {
//         res.status(500).json({ message: "API is not working" });
//     }
// });

// app.get('/', (req, res) => {
//     try {
//         res.json({ message: "API is working" });
//     } catch {
//         res.status(500).json({ message: "API is not working" });
//     }
// });

// app.post('/api/insert', (req, res) => {
//     const { equation, method, result } = req.body;
//     const calculation = { equation, method, result };

//     // Insert data into the MongoDB collection
//     db.collection('calculation_logs') // Ensure 'calculations' collection exists
//         .insertOne(calculation)
//         .then(result => {
//             res.json({
//                 msg: "Data inserted successfully",
//                 insertID: result.insertedId
//             });
//         })
//         .catch(err => {
//             console.log("Error inserting data:", err);
//             res.status(500).json({ error: "Internal server error" });
//         });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// module.exports = app;
//MongoAcc:chorunrit MongoPass:j9W5rTM4haUuRYDm
//mongodb+srv://chorunrit:<db_password>@cluster0.6p3he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0