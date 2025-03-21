const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'todo',
  password: 'Ra9Dhura',
  port: 5432,
});

app.use(cors());
app.use(express.json());  // Allow parsing of JSON request bodies

// Route to handle the root path
app.get('/', (req, res) => {
  res.send('Server is running');
});

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
    res.status(200).json(result.rows[0]);  // Return the newly added task with ID
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a task
app.delete('/task/:id', async (req, res) => {
  const { id } = req.params;
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
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
