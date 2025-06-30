import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST: Submit proposal to a tender
router.post('/:tenderId', authMiddleware, async (req, res) => {
  const { proposal } = req.body;
  const { tenderId } = req.params;
  const userId = req.user.userId;

  try {
    // Get applicant's company_id
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const applicantCompanyId = company.rows[0].id;

    // Check if already applied
    const check = await pool.query(
      'SELECT * FROM applications WHERE tender_id = $1 AND applicant_company_id = $2',
      [tenderId, applicantCompanyId]
    );
    if (check.rows.length) {
      return res.status(400).json({ error: 'Already applied to this tender' });
    }

    const result = await pool.query(
      'INSERT INTO applications (tender_id, applicant_company_id, proposal) VALUES ($1, $2, $3) RETURNING *',
      [tenderId, applicantCompanyId, proposal]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not submit proposal' });
  }
});

// GET: Applications for a tender (by tender owner)
router.get('/tender/:tenderId', authMiddleware, async (req, res) => {
  const { tenderId } = req.params;
  const userId = req.user.userId;

  try {
    // Ensure the logged-in user owns the tender
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;
    const tender = await pool.query('SELECT * FROM tenders WHERE id = $1 AND company_id = $2', [tenderId, companyId]);
    if (!tender.rows.length) return res.status(403).json({ error: 'Unauthorized' });

    const apps = await pool.query(`
      SELECT a.*, c.name AS applicant_name
      FROM applications a
      JOIN companies c ON a.applicant_company_id = c.id
      WHERE a.tender_id = $1
      ORDER BY a.created_at DESC
    `, [tenderId]);

    res.json(apps.rows);
  } catch {
    res.status(500).json({ error: 'Error retrieving applications' });
  }
});

// GET: All proposals submitted by current company
router.get('/my', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const company = await pool.query('SELECT id FROM companies WHERE user_id = $1', [userId]);
    if (!company.rows.length) return res.status(400).json({ error: 'Company not found' });

    const companyId = company.rows[0].id;

    const apps = await pool.query(`
      SELECT a.*, t.title AS tender_title
      FROM applications a
      JOIN tenders t ON a.tender_id = t.id
      WHERE a.applicant_company_id = $1
      ORDER BY a.created_at DESC
    `, [companyId]);

    res.json(apps.rows);
  } catch {
    res.status(500).json({ error: 'Error fetching your proposals' });
  }
});

export default router;
