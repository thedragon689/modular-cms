import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { status, author_id, limit = 20, offset = 0 } = req.query;
    let query = `
      SELECT p.*, u.name as author_name, u.avatar as author_avatar
      FROM blog_posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND p.status = $${paramCount++}`;
      params.push(status);
    }
    if (author_id) {
      query += ` AND p.author_id = $${paramCount++}`;
      params.push(author_id);
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json({ posts: result.rows });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const isNumeric = /^\d+$/.test(identifier);
    
    const query = isNumeric
      ? 'SELECT p.*, u.name as author_name, u.avatar as author_avatar FROM blog_posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id = $1'
      : 'SELECT p.*, u.name as author_name, u.avatar as author_avatar FROM blog_posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.slug = $1';
    
    const result = await pool.query(query, [identifier]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, slug, content, excerpt, featured_image, url, status = 'draft' } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and slug are required' });
    }

    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, url, author_id, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        title,
        slug,
        content || '',
        excerpt || '',
        featured_image || null,
        url || null,
        req.user.id,
        status,
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Slug already exists' });
    }
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, featured_image, url, status } = req.body;

    // Check if post exists and user has permission
    const postCheck = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postCheck.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
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
    if (excerpt !== undefined) {
      updates.push(`excerpt = $${paramCount++}`);
      values.push(excerpt);
    }
    if (featured_image !== undefined) {
      updates.push(`featured_image = $${paramCount++}`);
      values.push(featured_image);
    }
    if (url !== undefined) {
      updates.push(`url = $${paramCount++}`);
      values.push(url);
    }
    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
      if (status === 'published' && postCheck.rows[0].status !== 'published') {
        updates.push(`published_at = CURRENT_TIMESTAMP`);
      }
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE blog_posts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const postCheck = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (postCheck.rows[0].author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

