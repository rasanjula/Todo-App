const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo',
  password: 'Ra9Dhura',
  port: 5432,
});

// Middleware to parse JSON and urlencoded data
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false }));  // Middleware to parse URL-encoded bodies

const port = 3001;

// Route to fetch all tasks
app.get('/task', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM task');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to add a new task
app.post('/new', async (req, res) => {
  const { description } = req.body;
  try {
    const result = await pool.query('INSERT INTO task (description) VALUES ($1) RETURNING *', [description]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a task using the task's id as a URL parameter
app.delete('/task/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting task with ID: ${id}`);  // Log the ID for debugging
  try {
    const result = await pool.query('DELETE FROM task WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
