require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Insert users at startup if they don't exist
async function createUsers() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL
      );
    `);

    const [rows] = await connection.query('SELECT * FROM users');
    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?)',
        [
          process.env.ADMIN_USERNAME,
          process.env.ADMIN_PASSWORD,
          'admin',
          process.env.USER_USERNAME,
          process.env.USER_PASSWORD,
          'user',
        ]
      );
      console.log('Admin and user inserted.');
    }
  } finally {
    connection.release();
  }
}

// Health Check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    if (user.role === 'admin') {
      return res.json({ message: 'Hello Admin' });
    } else {
      return res.json({ message: 'Hello User' });
    }
  } finally {
    connection.release();
  }
});

// Start server
app.listen(port, async () => {
  console.log(`Backend running at http://localhost:${port}`);
  await createUsers();
});

