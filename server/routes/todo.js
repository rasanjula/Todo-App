const express = require('express');
const router = express.Router(); // Create a new router instance
const { query } = require('../helpers/db'); // Import the query function from db.js

// Route to fetch all tasks
router.get("/tasks", async (req, res) => {
  console.log("GET /tasks request received...");
  try {
    const result = await query('SELECT * FROM task');  // Query to get all tasks
    const rows = result.rows.length > 0 ? result.rows : [];
    console.log("Tasks fetched from DB:", rows); // Log the fetched tasks
    res.status(200).json(rows);  // Send the result as JSON
  } catch (error) {
    console.log("Error fetching tasks:", error);  // Log the error
    res.status(500).json({ error: error.message });  // Send error response to client
  }
});

// Route to add a new task
router.post('/new', async (req, res) => {
  try {
    const result = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', [req.body.description]);
    res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error adding task:', error);  // Detailed error log
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a task using the task's id as a URL parameter
router.delete('/delete/:id', async (req, res) => {
  const id = Number(req.params.id);  // Convert ID to a number
  try {
    const result = await query('DELETE FROM task WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ id: id });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);  // Detailed error log
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;  // Export the router to be used in index.js
