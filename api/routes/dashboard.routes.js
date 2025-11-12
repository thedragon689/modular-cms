import express from 'express';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = {};

    // Total posts
    const postsResult = await pool.query('SELECT COUNT(*) as count FROM blog_posts');
    stats.totalPosts = parseInt(postsResult.rows[0].count);

    // Published posts
    const publishedResult = await pool.query("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'");
    stats.publishedPosts = parseInt(publishedResult.rows[0].count);

    // Draft posts
    const draftResult = await pool.query("SELECT COUNT(*) as count FROM blog_posts WHERE status = 'draft'");
    stats.draftPosts = parseInt(draftResult.rows[0].count);

    // Total pages
    const pagesResult = await pool.query('SELECT COUNT(*) as count FROM pages');
    stats.totalPages = parseInt(pagesResult.rows[0].count);

    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    stats.totalUsers = parseInt(usersResult.rows[0].count);

    // Total media
    const mediaResult = await pool.query('SELECT COUNT(*) as count FROM media');
    stats.totalMedia = parseInt(mediaResult.rows[0].count);

    // Recent posts
    const recentPostsResult = await pool.query(
      `SELECT p.*, u.name as author_name 
       FROM blog_posts p 
       LEFT JOIN users u ON p.author_id = u.id 
       ORDER BY p.created_at DESC 
       LIMIT 5`
    );
    stats.recentPosts = recentPostsResult.rows;

    // Recent users
    const recentUsersResult = await pool.query(
      'SELECT id, email, name, role, avatar, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    stats.recentUsers = recentUsersResult.rows;

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

