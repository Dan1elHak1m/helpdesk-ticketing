const router = require('express').Router();
const db = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth); // every route below needs a login

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

// List tickets: users see their own, agents/admins see all
router.get('/', async (req, res) => {
  const { status, priority } = req.query;
  const where = [];
  const params = [];

  if (req.user.role === 'user') {
    where.push('t.created_by = ?');
    params.push(req.user.id);
  }
  if (status) {
    where.push('t.status = ?');
    params.push(status);
  }
  if (priority) {
    where.push('t.priority = ?');
    params.push(priority);
  }

  const sql = `
    SELECT t.*, u.name AS created_by_name, a.name AS assigned_to_name
    FROM tickets t
    JOIN users u ON u.id = t.created_by
    LEFT JOIN users a ON a.id = t.assigned_to
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY t.created_at DESC`;

  const [rows] = await db.query(sql, params);
  res.json(rows);
});

// Create a ticket
router.post('/', async (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const [r] = await db.query(
    'INSERT INTO tickets (title, description, priority, created_by) VALUES (?,?,?,?)',
    [title, description, priority || 'medium', req.user.id]
  );

  res.status(201).json({ id: r.insertId });
});

// One ticket with its comments
router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    `SELECT t.*, u.name AS created_by_name, a.name AS assigned_to_name
     FROM tickets t
     JOIN users u ON u.id = t.created_by
     LEFT JOIN users a ON a.id = t.assigned_to
     WHERE t.id = ?`,
    [req.params.id]
  );

  const ticket = rows[0];
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

  if (req.user.role === 'user' && ticket.created_by !== req.user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const [comments] = await db.query(
    `SELECT c.*, u.name AS user_name
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.ticket_id = ? ORDER BY c.created_at`,
    [req.params.id]
  );

  res.json({ ...ticket, comments });
});

// Agents/admins change status or assignee
router.patch('/:id', requireRole('agent', 'admin'), async (req, res) => {
  const { status, assigned_to } = req.body;
  const fields = [];
  const params = [];

  if (status) {
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    fields.push('status = ?');
    params.push(status);
  }
  if (assigned_to !== undefined) {
    fields.push('assigned_to = ?');
    params.push(assigned_to);
  }
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update' });

  params.push(req.params.id);
  await db.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ message: 'Ticket updated' });
});

// Add a comment
router.post('/:id/comments', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const [rows] = await db.query('SELECT created_by FROM tickets WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Ticket not found' });

  if (req.user.role === 'user' && rows[0].created_by !== req.user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  await db.query(
    'INSERT INTO comments (ticket_id, user_id, message) VALUES (?,?,?)',
    [req.params.id, req.user.id, message]
  );

  res.status(201).json({ message: 'Comment added' });
});

module.exports = router;