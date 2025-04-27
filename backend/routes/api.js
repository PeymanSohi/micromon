const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const db = require('../config/database');

// Authentication Routes
router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User Management Routes
router.get('/users', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, role, status FROM users');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/users', [
  auth,
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Metrics Routes
router.get('/metrics/system', auth, async (req, res) => {
  try {
    const [cpuUsage] = await db.query('SELECT * FROM system_metrics WHERE metric_type = "cpu" ORDER BY timestamp DESC LIMIT 1');
    const [memoryUsage] = await db.query('SELECT * FROM system_metrics WHERE metric_type = "memory" ORDER BY timestamp DESC LIMIT 1');
    const [diskUsage] = await db.query('SELECT * FROM system_metrics WHERE metric_type = "disk" ORDER BY timestamp DESC LIMIT 1');

    res.json({
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/metrics/history', auth, async (req, res) => {
  try {
    const { type, hours } = req.query;
    const [metrics] = await db.query(
      'SELECT * FROM system_metrics WHERE metric_type = ? AND timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR) ORDER BY timestamp',
      [type, hours || 24]
    );
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Alert Management Routes
router.get('/alerts', auth, async (req, res) => {
  try {
    const [alerts] = await db.query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/alerts', [
  auth,
  check('name', 'Alert name is required').not().isEmpty(),
  check('condition', 'Alert condition is required').not().isEmpty(),
  check('severity', 'Alert severity is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, condition, severity, description } = req.body;

  try {
    await db.query(
      'INSERT INTO alerts (name, condition, severity, description, status) VALUES (?, ?, ?, ?, "active")',
      [name, condition, severity, description]
    );
    res.status(201).json({ message: 'Alert created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// System Settings Routes
router.get('/settings', auth, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM system_settings');
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/settings', [
  auth,
  check('backup_enabled', 'Backup enabled status is required').isBoolean(),
  check('notification_enabled', 'Notification enabled status is required').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { backup_enabled, notification_enabled, backup_frequency } = req.body;

  try {
    await db.query(
      'UPDATE system_settings SET backup_enabled = ?, notification_enabled = ?, backup_frequency = ?',
      [backup_enabled, notification_enabled, backup_frequency]
    );
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// System Logs Routes
router.get('/logs', auth, async (req, res) => {
  try {
    const { level, startDate, endDate, limit = 100 } = req.query;
    let query = 'SELECT * FROM system_logs';
    const params = [];

    if (level) {
      query += ' WHERE level = ?';
      params.push(level);
    }

    if (startDate && endDate) {
      query += level ? ' AND' : ' WHERE';
      query += ' timestamp BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(parseInt(limit));

    const [logs] = await db.query(query, params);
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Backup Management Routes
router.get('/backups', auth, async (req, res) => {
  try {
    const [backups] = await db.query('SELECT * FROM backups ORDER BY created_at DESC');
    res.json(backups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/backups', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.query(
      'INSERT INTO backups (name, description, status) VALUES (?, ?, "pending")',
      [name, description]
    );
    res.status(201).json({ message: 'Backup scheduled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Notification Settings Routes
router.get('/notifications', auth, async (req, res) => {
  try {
    const [notifications] = await db.query('SELECT * FROM notification_settings WHERE user_id = ?', [req.user.id]);
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/notifications', [
  auth,
  check('email_enabled', 'Email enabled status is required').isBoolean(),
  check('slack_enabled', 'Slack enabled status is required').isBoolean(),
  check('webhook_enabled', 'Webhook enabled status is required').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email_enabled, slack_enabled, webhook_enabled, email, slack_webhook, webhook_url } = req.body;

  try {
    await db.query(
      'UPDATE notification_settings SET email_enabled = ?, slack_enabled = ?, webhook_enabled = ?, email = ?, slack_webhook = ?, webhook_url = ? WHERE user_id = ?',
      [email_enabled, slack_enabled, webhook_enabled, email, slack_webhook, webhook_url, req.user.id]
    );
    res.json({ message: 'Notification settings updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// System Health Routes
router.get('/health/detailed', auth, async (req, res) => {
  try {
    const [systemHealth] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
        (SELECT COUNT(*) FROM alerts WHERE status = 'active') as active_alerts,
        (SELECT COUNT(*) FROM backups WHERE status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) as recent_backups,
        (SELECT COUNT(*) FROM system_logs WHERE level = 'error' AND timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)) as recent_errors
    `);
    res.json(systemHealth[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Health Check Route
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

module.exports = router; 