import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// CREATE a tender
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, deadline, budget } = req.body;
  const userId = req.user.userId;

  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;
    const tender = await pool.query(
      'INSERT INTO tenders (company_id, title, description, deadline, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [companyId, title, description, deadline, budget]
    );
    res.status(201).json(tender.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating tender' });
  }
});

// GET all tenders (paginated)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const tenders = await pool.query(
      'SELECT t.*, c.name as company_name FROM tenders t JOIN companies c ON t.company_id = c.id ORDER BY t.id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    res.json({ page, tenders: tenders.rows });
  } catch {
    res.status(500).json({ error: 'Error fetching tenders' });
  }
});

// GET tenders by current company
router.get('/my', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;
    const tenders = await pool.query('SELECT * FROM tenders WHERE company_id = $1 ORDER BY id DESC', [companyId]);
    res.json(tenders.rows);
  } catch {
    res.status(500).json({ error: 'Error fetching your tenders' });
  }
});

// GET tender by ID
router.get('/:id', async (req, res) => {
  try {
    const tender = await pool.query(
      'SELECT t.*, c.name AS company_name FROM tenders t JOIN companies c ON t.company_id = c.id WHERE t.id = $1',
      [req.params.id]
    );
    if (!tender.rows.length) return res.status(404).json({ error: 'Tender not found' });
    res.json(tender.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error fetching tender' });
  }
});

// UPDATE tender
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, deadline, budget } = req.body;
  const userId = req.user.userId;
  const tenderId = req.params.id;

  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;
    const update = await pool.query(
      'UPDATE tenders SET title=$1, description=$2, deadline=$3, budget=$4 WHERE id=$5 AND company_id=$6 RETURNING *',
      [title, description, deadline, budget, tenderId, companyId]
    );
    if (!update.rows.length) return res.status(403).json({ error: 'Unauthorized or not found' });

    res.json(update.rows[0]);
  } catch {
    res.status(500).json({ error: 'Error updating tender' });
  }
});

// DELETE tender
router.delete('/:id', authMiddleware, async (req, res) => {
  const tenderId = req.params.id;
  const userId = req.user.userId;

  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;
    const deleted = await pool.query('DELETE FROM tenders WHERE id = $1 AND company_id = $2 RETURNING *', [tenderId, companyId]);

    if (!deleted.rows.length) return res.status(403).json({ error: 'Unauthorized or not found' });

    res.json({ message: 'Tender deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Error deleting tender' });
  }
});

export default router;

// All protected routes require Authorization: Bearer <token>