const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Manoi1348_",
    database: "mynumer_log2"
});

// Test MySQL connection
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    next();
});

app.post('/api/insert', (req, res) => {
    const { equation, method, result } = req.body;
    const query = "INSERT INTO calculations(equation, method, result) VALUES (?, ?, ?)";
    connection.query(query, [equation, method, result], (err, results) => {
        if (err) {
            console.log("Error loading data:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({
            msg: "Data inserted successfully",
            insertID: results.insertId
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
