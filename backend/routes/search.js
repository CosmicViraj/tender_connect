import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/search?query=xyz
router.get('/', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const companies = await pool.query(`
      SELECT DISTINCT c.*
      FROM companies c
      LEFT JOIN goods_and_services g ON g.company_id = c.id
      WHERE 
        LOWER(c.name) ILIKE LOWER($1)
        OR LOWER(c.industry) ILIKE LOWER($1)
        OR LOWER(g.name) ILIKE LOWER($1)
    `, [`%${query}%`]);

    res.json(companies.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
