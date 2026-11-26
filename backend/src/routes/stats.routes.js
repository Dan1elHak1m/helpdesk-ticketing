const router = require('express').Router();
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, requireRole('agent', 'admin'), async (req, res) => {
  const [byStatus] = await db.query('SELECT status, COUNT(*) AS count FROM tickets GROUP BY status');
  const [byPriority] = await db.query('SELECT priority, COUNT(*) AS count FROM tickets GROUP BY priority');
  res.json({ byStatus, byPriority });
});

module.exports = router;