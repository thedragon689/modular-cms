import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all clients
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clients ORDER BY created_at DESC'
    );
    res.json({ clients: result.rows });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ client: result.rows[0] });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create client
router.post(
  '/',
  authenticate,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, company, address, notes } = req.body;

      const result = await pool.query(
        `INSERT INTO clients (name, email, phone, company, address, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [name, email, phone || null, company || null, address || null, notes || null, req.user.id]
      );

      res.status(201).json({ client: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Create client error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update client
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, email, phone, company, address, notes } = req.body;

      const clientCheck = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      if (clientCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (name) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (email) {
        updates.push(`email = $${paramCount++}`);
        values.push(email);
      }
      if (phone !== undefined) {
        updates.push(`phone = $${paramCount++}`);
        values.push(phone);
      }
      if (company !== undefined) {
        updates.push(`company = $${paramCount++}`);
        values.push(company);
      }
      if (address !== undefined) {
        updates.push(`address = $${paramCount++}`);
        values.push(address);
      }
      if (notes !== undefined) {
        updates.push(`notes = $${paramCount++}`);
        values.push(notes);
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `UPDATE clients SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      res.json({ client: result.rows[0] });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Update client error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete client
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const clientCheck = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;



