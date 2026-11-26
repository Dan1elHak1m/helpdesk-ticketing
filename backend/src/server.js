const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', require('./routes/users.routes'));

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS ok');
    res.json({ server: 'up', database: rows[0].ok === 1 ? 'connected' : 'error' });
  } catch (err) {
    res.status(500).json({ server: 'up', database: 'error', message: err.message });
  }
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tickets', require('./routes/tickets.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

// last: catches errors so the server doesn't crash
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));