const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// MongoDB client and database variable
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(); // Get the database
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

app.get('/api/test', (req, res) => {
    try {
        res.json({ message: "test API is working" });
    } catch {
        res.status(500).json({ message: "API is not working" });
    }
});

app.get('/', (req, res) => {
    try {
        res.json({ message: "API is working" });
    } catch {
        res.status(500).json({ message: "API is not working" });
    }
});

app.post('/api/insert', (req, res) => {
    const { equation, method, result } = req.body;
    const calculation = { equation, method, result };

    // Insert data into the MongoDB collection
    db.collection('calculation_logs') // Ensure 'calculations' collection exists
        .insertOne(calculation)
        .then(result => {
            res.json({
                msg: "Data inserted successfully",
                insertID: result.insertedId
            });
        })
        .catch(err => {
            console.log("Error inserting data:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
//MongoAcc:chorunrit MongoPass:j9W5rTM4haUuRYDm
//mongodb+srv://chorunrit:<db_password>@cluster0.6p3he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0