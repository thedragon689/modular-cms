import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import pool from '../config/database.js';
import { authenticate } from '../middleware/auth.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|mp4|mov|avi|webm|mkv|mp3|wav|ogg|m4a|aac|flac/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/');

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all media
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT m.*, u.name as uploaded_by_name FROM media m LEFT JOIN users u ON m.uploaded_by = u.id ORDER BY m.created_at DESC'
    );
    res.json({ media: result.rows });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload media
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await pool.query(
      'INSERT INTO media (filename, original_name, mime_type, size, path, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        `/uploads/${req.file.filename}`,
        req.user.id
      ]
    );

    res.status(201).json({ media: result.rows[0] });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete media
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const mediaCheck = await pool.query('SELECT * FROM media WHERE id = $1', [id]);
    if (mediaCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const media = mediaCheck.rows[0];

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM media WHERE id = $1', [id]);

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

