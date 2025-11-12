import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all pages
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.name as author_name FROM pages p LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC'
    );
    res.json({ pages: result.rows });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get page by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query(
      'SELECT p.*, u.name as author_name FROM pages p LEFT JOIN users u ON p.author_id = u.id WHERE p.slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ page: result.rows[0] });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create page
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, slug, content, template, status = 'draft' } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and slug are required' });
    }

    const result = await pool.query(
      'INSERT INTO pages (title, slug, content, template, status, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, slug, content || '', template || 'default', status, req.user.id]
    );

    res.status(201).json({ page: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Create page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update page
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, template, status } = req.body;

    const pageCheck = await pool.query('SELECT * FROM pages WHERE id = $1', [id]);
    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    if (pageCheck.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (slug) {
      updates.push(`slug = $${paramCount++}`);
      values.push(slug);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }
    if (template) {
      updates.push(`template = $${paramCount++}`);
      values.push(template);
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE pages SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    res.json({ page: result.rows[0] });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete page
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const pageCheck = await pool.query('SELECT * FROM pages WHERE id = $1', [id]);
    if (pageCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    if (pageCheck.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await pool.query('DELETE FROM pages WHERE id = $1', [id]);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

