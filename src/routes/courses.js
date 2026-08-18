const express = require('express');
const db = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses?lang=fr  -> liste des cours publiés, traduits dans la langue demandée
router.get('/', async (req, res) => {
  const interfaceLang = req.query.lang || 'en';

  try {
    const result = await db.query(
      `SELECT c.id, c.slug, c.level, c.price, l.code AS taught_language,
              ct.title, ct.description
       FROM courses c
       JOIN languages l ON l.id = c.language_id
       JOIN languages il ON il.code = $1
       LEFT JOIN course_translations ct ON ct.course_id = c.id AND ct.interface_language_id = il.id
       WHERE c.is_published = TRUE
       ORDER BY c.created_at DESC`,
      [interfaceLang]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET /api/courses/:slug -> détail d'un cours + leçons (verrouillage selon accès utilisateur)
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const interfaceLang = req.query.lang || 'en';

  try {
    const courseResult = await db.query(
      `SELECT c.id, c.slug, c.level, c.price, l.code AS taught_language,
              ct.title, ct.description
       FROM courses c
       JOIN languages l ON l.id = c.language_id
       JOIN languages il ON il.code = $1
       LEFT JOIN course_translations ct ON ct.course_id = c.id AND ct.interface_language_id = il.id
       WHERE c.slug = $2 AND c.is_published = TRUE`,
      [interfaceLang, slug]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Cours introuvable.' });
    }

    const course = courseResult.rows[0];

    const lessonsResult = await db.query(
      `SELECT id, order_index, title FROM lessons
       WHERE course_id = $1 ORDER BY order_index ASC`,
      [course.id]
    );

    course.lessons = lessonsResult.rows;
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// GET /api/courses/:lessonId/content -> contenu (pdf/audio/vidéo) - PROTÉGÉ
router.get('/lessons/:lessonId/content', requireAuth, async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  try {
    // 1. Vérifier que la leçon est débloquée pour cet utilisateur
    const progress = await db.query(
      `SELECT status FROM user_progress WHERE user_id = $1 AND lesson_id = $2`,
      [userId, lessonId]
    );

    const status = progress.rows[0]?.status;
    if (!status || status === 'locked') {
      return res.status(403).json({ message: 'Cette leçon n\'est pas encore débloquée.' });
    }

    // 2. Récupérer le contenu média
    const content = await db.query(
      `SELECT type, file_url, duration_seconds FROM lesson_content WHERE lesson_id = $1`,
      [lessonId]
    );

    res.json(content.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST /api/courses/lessons/:lessonId/complete -> débloque la leçon suivante
router.post('/lessons/:lessonId/complete', requireAuth, async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  try {
    // Marquer la leçon actuelle comme complétée
    await db.query(
      `INSERT INTO user_progress (user_id, lesson_id, status, completed_at)
       VALUES ($1, $2, 'completed', now())
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET status = 'completed', completed_at = now()`,
      [userId, lessonId]
    );

    // Trouver la leçon suivante dans le même cours et la débloquer
    const current = await db.query(
      `SELECT course_id, order_index FROM lessons WHERE id = $1`,
      [lessonId]
    );
    const { course_id, order_index } = current.rows[0];

    const next = await db.query(
      `SELECT id FROM lessons WHERE course_id = $1 AND order_index > $2
       ORDER BY order_index ASC LIMIT 1`,
      [course_id, order_index]
    );

    if (next.rows[0]) {
      await db.query(
        `INSERT INTO user_progress (user_id, lesson_id, status)
         VALUES ($1, $2, 'unlocked')
         ON CONFLICT (user_id, lesson_id) DO NOTHING`,
        [userId, next.rows[0].id]
      );
    }

    res.json({ message: 'Leçon marquée comme terminée.', next_lesson_unlocked: !!next.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
