require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { i18next, middleware: i18nMiddleware } = require('./src/config/i18n');

const authRoutes = require('./src/routes/auth');
const courseRoutes = require('./src/routes/courses');
const paymentRoutes = require('./src/routes/payments');
const faqRoutes = require('./src/routes/faq');

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());

// La route webhook Stripe a besoin du body brut -> déclarée AVANT express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(i18nMiddleware.handle(i18next));

app.use(express.static('public'));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/faq', faqRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur dawadiaspora.com démarré sur le port ${PORT}`);
});
