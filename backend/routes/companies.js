import express from 'express';
import multer from 'multer';
import pool from '../db.js';
import supabase from '../supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE or UPDATE company profile
router.post('/', authMiddleware, async (req, res) => {
  const { name, industry, description } = req.body;
  const userId = req.user.userId;

  try {
    const existing = await pool.query('SELECT * FROM companies WHERE user_id = $1', [userId]);
    if (existing.rows.length) {
      // Update
      const update = await pool.query(
        'UPDATE companies SET name=$1, industry=$2, description=$3 WHERE user_id=$4 RETURNING *',
        [name, industry, description, userId]
      );
      return res.json(update.rows[0]);
    } else {
      // Insert
      const insert = await pool.query(
        'INSERT INTO companies (user_id, name, industry, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, name, industry, description]
      );
      return res.status(201).json(insert.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating/updating company' });
  }
});

// GET my company
router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const company = await pool.query('SELECT * FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(404).json({ error: 'Company not found' });
    res.json(company.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error fetching company' });
  }
});

// UPLOAD logo image to Supabase
router.post('/upload-logo', authMiddleware, upload.single('logo'), async (req, res) => {
  const userId = req.user.userId;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const fileName = `logos/${userId}_${Date.now()}_${file.originalname}`;
  const { data, error } = await supabase.storage
    .from('company-logos')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) return res.status(500).json({ error: 'Upload failed' });

  const publicURL = supabase.storage.from('company-logos').getPublicUrl(fileName).data.publicUrl;

  await pool.query('UPDATE companies SET logo_url=$1 WHERE user_id=$2', [publicURL, userId]);

  res.json({ message: 'Uploaded successfully', logo_url: publicURL });
});

// GET company by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const company = await pool.query('SELECT * FROM companies WHERE id = $1', [id]);
    if (!company.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(company.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error fetching company' });
  }
});

// Add a good/service to your company
router.post('/services', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;

    const insert = await pool.query(
      'INSERT INTO goods_and_services (company_id, name) VALUES ($1, $2) RETURNING *',
      [companyId, name]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding service' });
  }
});


//All of them use Authorization: Bearer <JWT> header for auth.