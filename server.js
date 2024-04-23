const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConnection');

connectDB()
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error Handler Middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});


//Hello everyone!!!!!!!!!