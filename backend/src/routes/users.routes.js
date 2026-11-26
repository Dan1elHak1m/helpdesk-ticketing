const router = require('express').Router();
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/agents', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name FROM users WHERE role IN ('agent','admin') ORDER BY name"
  );
  res.json(rows);
});

module.exports = router;