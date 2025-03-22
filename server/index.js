require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const todoRouter = require('./routes/todo');  // Import the todoRouter from todo.js
const app = express();

// Middleware to parse JSON and urlencoded data
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false }));  // Middleware to parse URL-encoded bodies

const port = process.env.PORT || 3001; // Default to 3001 if not set in .env

// Use the todoRouter for handling task-related routes
app.use('/', todoRouter); // Mount the todoRouter at the root path

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
