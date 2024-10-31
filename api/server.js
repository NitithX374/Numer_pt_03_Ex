const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
   host: process.env.DB_HOST,      
   user: process.env.DB_USER,      
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
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
app.get('/api/test' ,(req, res) =>{
    try{
        res.json({message:"API is working"})
    }catch{
        res.status(500).json({message:"API is not working"})
    }
})
app.post('/api/insert', (req, res) => {
    try{
        res.json({message:"API is working"})
    }catch{
        res.status(500).json({message:"API is not working"})
    }
    // const { equation, method, result } = req.body;
    // const query = "INSERT INTO calculations(equation, method, result) VALUES (?, ?, ?)";
    // connection.query(query, [equation, method, result], (err, results) => {
    //     if (err) {
    //         console.log("Error loading data:", err);
    //         return res.status(500).json({ error: "Internal server error" });
    //     }
    //     res.json({
    //         msg: "Data inserted successfully",
    //         insertID: results.insertId
    //     });
    // });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
// const connection = mysql.createConnection({                                   use this to connect to my db
//     host: process.env.DB_HOST,      // Access the environment variable
//     user: process.env.DB_USER,      // Access the environment variable
//     password: process.env.DB_PASSWORD,// Access the environment variable
//     database: process.env.DB_NAME    // Access the environment variable
// });
