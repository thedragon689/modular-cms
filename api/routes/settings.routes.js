import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings');
    const settings = {};
    result.rows.forEach(row => {
      let value = row.value;
      if (row.type === 'number') {
        value = parseFloat(value);
      } else if (row.type === 'boolean') {
        value = value === 'true';
      } else if (row.type === 'json') {
        value = JSON.parse(value);
      }
      settings[row.key] = value;
    });
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const result = await pool.query('SELECT * FROM settings WHERE key = $1', [key]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    const setting = result.rows[0];
    let value = setting.value;
    if (setting.type === 'number') {
      value = parseFloat(value);
    } else if (setting.type === 'boolean') {
      value = value === 'true';
    } else if (setting.type === 'json') {
      value = JSON.parse(value);
    }

    res.json({ [key]: value });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      let type = 'string';
      let processedValue = value;

      if (typeof value === 'number') {
        type = 'number';
        processedValue = value.toString();
      } else if (typeof value === 'boolean') {
        type = 'boolean';
        processedValue = value.toString();
      } else if (typeof value === 'object') {
        type = 'json';
        processedValue = JSON.stringify(value);
      }

      await pool.query(
        `INSERT INTO settings (key, value, type, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = $2, type = $3, updated_at = CURRENT_TIMESTAMP`,
        [key, processedValue, type]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

