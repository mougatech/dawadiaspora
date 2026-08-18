const express = require('express');
const Stripe = require('stripe');
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/course/:courseId -> achat unique d'un cours
router.post('/course/:courseId', requireAuth, async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const course = await db.query('SELECT price, slug FROM courses WHERE id = $1', [courseId]);
    if (!course.rows[0]) return res.status(404).json({ message: 'Cours introuvable.' });

    const { price, slug } = course.rows[0];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Cours : ${slug}` },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { userId, courseId, type: 'course_purchase' },
      success_url: `${process.env.APP_URL}/courses/${slug}?success=true`,
      cancel_url: `${process.env.APP_URL}/courses/${slug}?cancelled=true`,
    });

    res.json({ checkout_url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du paiement.' });
  }
});

// POST /api/payments/subscribe -> abonnement global (monthly/yearly)
router.post('/subscribe', requireAuth, async (req, res) => {
  const { plan } = req.body; // 'monthly' | 'yearly'
  const userId = req.user.id;

  const priceIds = {
    monthly: process.env.STRIPE_PRICE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_YEARLY,
  };

  if (!priceIds[plan]) return res.status(400).json({ message: 'Plan invalide.' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceIds[plan], quantity: 1 }],
      metadata: { userId, plan, type: 'subscription' },
      success_url: `${process.env.APP_URL}/account?success=true`,
      cancel_url: `${process.env.APP_URL}/pricing?cancelled=true`,
    });

    res.json({ checkout_url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'abonnement.' });
  }
});

// POST /api/payments/donate -> don ponctuel (montant libre ou suggéré)
router.post('/donate', async (req, res) => {
  const { amount, userId } = req.body; // userId optionnel (don anonyme possible)

  if (!amount || amount < 1) {
    return res.status(400).json({ message: 'Montant invalide.' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Don à dawadiaspora.com' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { userId: userId || '', type: 'donation' },
      success_url: `${process.env.APP_URL}/donate?success=true`,
      cancel_url: `${process.env.APP_URL}/donate?cancelled=true`,
    });

    res.json({ checkout_url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création du don.' });
  }
});

// POST /api/payments/webhook -> Stripe confirme les paiements ici
// IMPORTANT : cette route doit utiliser express.raw() dans server.js, pas express.json()
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature invalide :', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, courseId, plan, type } = session.metadata;

    try {
      if (type === 'course_purchase') {
        await db.query(
          `INSERT INTO purchases (user_id, course_id, stripe_payment_id)
           VALUES ($1, $2, $3)`,
          [userId, courseId, session.payment_intent]
        );

        // Débloquer la première leçon du cours
        const firstLesson = await db.query(
          `SELECT id FROM lessons WHERE course_id = $1 ORDER BY order_index ASC LIMIT 1`,
          [courseId]
        );
        if (firstLesson.rows[0]) {
          await db.query(
            `INSERT INTO user_progress (user_id, lesson_id, status)
             VALUES ($1, $2, 'unlocked') ON CONFLICT DO NOTHING`,
            [userId, firstLesson.rows[0].id]
          );
        }
      }

      if (type === 'subscription') {
        await db.query(
          `INSERT INTO subscriptions (user_id, plan, stripe_subscription_id, status, current_period_end)
           VALUES ($1, $2, $3, 'active', now() + INTERVAL '1 month')`,
          [userId, plan, session.subscription]
        );
      }

      if (type === 'donation') {
        await db.query(
          `INSERT INTO donations (user_id, amount, currency, stripe_payment_id)
           VALUES ($1, $2, $3, $4)`,
          [userId || null, session.amount_total / 100, session.currency, session.payment_intent]
        );
      }
    } catch (err) {
      console.error('Erreur lors du traitement du webhook :', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
