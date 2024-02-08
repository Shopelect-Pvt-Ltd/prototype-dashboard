// server.js

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Import dotenv for environment variables

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL database configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT,
  ssl: {
    rejectUnauthorized: false // Only necessary if you're using SSL
  }
});

// API endpoint to fetch data from PostgreSQL database
app.get('/api/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM gstcreds');
    const data = result.rows;
    client.release();
    res.json(data);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
