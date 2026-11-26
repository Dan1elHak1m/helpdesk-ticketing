require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const users = [
      { name: 'Aiman Hakim', email: 'user@helpdesk.local', role: 'user' },
      { name: 'Farah Nadia', email: 'agent@helpdesk.local', role: 'agent' },
      { name: 'Syafiq Razak', email: 'admin@helpdesk.local', role: 'admin' },
    ];

    for (const u of users) {
      await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role)`,
        [u.name, u.email, passwordHash, u.role]
      );
    }

    const [[requester]] = await db.query(
      "SELECT id FROM users WHERE email = 'user@helpdesk.local'"
    );
    const [[agent]] = await db.query(
      "SELECT id FROM users WHERE email = 'agent@helpdesk.local'"
    );

    const [[existingCount]] = await db.query(
      'SELECT COUNT(*) AS total FROM tickets'
    );

    if (existingCount.total === 0) {
      const tickets = [
        [
          'VPN connection drops after 15 minutes',
          'Work-from-home VPN disconnects intermittently when transferring files to the internal drive.',
          'high',
          'open',
          requester.id,
          agent.id,
        ],
        [
          'Request access to staging analytics database',
          'Need read-only credentials for testing reporting queries on the staging environment.',
          'medium',
          'open',
          requester.id,
          null,
        ],
        [
          'Email signature template formatting broken in webmail',
          'Company logo wraps onto a second line on wide desktop screens.',
          'low',
          'in_progress',
          requester.id,
          agent.id,
        ],
        [
          'SSO login returns 502 gateway error on peak hours',
          'Several staff members saw a 502 error this morning when signing into internal portals.',
          'urgent',
          'in_progress',
          requester.id,
          agent.id,
        ],
        [
          'Replace faulty USB-C dock at workstation B12',
          'External monitor flickers continuously; tested with a known-good cable.',
          'medium',
          'resolved',
          requester.id,
          agent.id,
        ],
        [
          'Add new team member to shared billing inbox',
          'Please grant standard reply permissions for the new finance executive.',
          'low',
          'resolved',
          requester.id,
          agent.id,
        ],
        [
          'Printer queue stuck on 3rd floor print server',
          'Print jobs remain queued without errors after restarting the local spooler.',
          'high',
          'closed',
          requester.id,
          agent.id,
        ],
        [
          'Update two-factor authentication phone number',
          'Replaced old mobile device and need MFA reset before Monday.',
          'medium',
          'closed',
          requester.id,
          agent.id,
        ],
      ];

      await db.query(
        `INSERT INTO tickets (title, description, priority, status, created_by, assigned_to)
         VALUES ?`,
        [tickets]
      );

      const [[firstTicket]] = await db.query(
        'SELECT id FROM tickets ORDER BY id ASC LIMIT 1'
      );

      if (firstTicket) {
        await db.query(
          `INSERT INTO comments (ticket_id, user_id, message)
           VALUES
             (?, ?, 'Investigating MTU settings and VPN gateway logs now.'),
             (?, ?, 'Thanks—it usually happens right after a large upload starts.')`,
          [firstTicket.id, agent.id, firstTicket.id, requester.id]
        );
      }
    }

    console.log('Seed completed successfully.');
    console.log('Test accounts (password: Password123!):');
    console.log('  User : user@helpdesk.local');
    console.log('  Agent: agent@helpdesk.local');
    console.log('  Admin: admin@helpdesk.local');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();