const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET /api/faq?lang=fr&category=audio
router.get('/', async (req, res) => {
  const lang = req.query.lang || 'en';
  const { category } = req.query; // 'audio' | 'video' | 'pdf' | undefined (= tous)

  try {
    let query = `
      SELECT fi.id, fi.category, fi.order_index,
             ft.question, ft.answer_text,
             fc.file_url
      FROM faq_items fi
      JOIN languages l ON l.code = $1
      LEFT JOIN faq_translations ft ON ft.faq_item_id = fi.id AND ft.language_id = l.id
      LEFT JOIN faq_content fc ON fc.faq_item_id = fi.id AND fc.language_id = l.id
    `;
    const params = [lang];

    if (category) {
      query += ` WHERE fi.category = $2`;
      params.push(category);
    }

    query += ` ORDER BY fi.category, fi.order_index ASC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
