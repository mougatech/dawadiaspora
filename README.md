# dawadiaspora.com — Backend

Plateforme de cours de langues multilingue (Anglais, Arabe, Français, Kinyarwanda, Swahili) avec contenu PDF/audio/vidéo, achats/abonnements Stripe, et système de progression.

## Installation

```bash
npm install
cp .env.example .env
# Remplir les variables dans .env (base de données, Stripe, JWT_SECRET...)
```

## Base de données

1. Créer une base PostgreSQL (localement ou via Hostinger/un hébergeur cloud comme Neon, Supabase, Railway)
2. Mettre à jour `DATABASE_URL` dans `.env`
3. Lancer la migration :

```bash
npm run migrate
```

Cela crée toutes les tables (users, courses, lessons, lesson_content, purchases, subscriptions, user_progress, faq_items, donations...) et insère les 5 langues de base.

## Démarrage

```bash
npm run dev     # avec rechargement automatique (nodemon)
npm start        # production
```

Le serveur démarre sur `http://localhost:3000` (ou le PORT défini dans `.env`).

## Structure du projet

```
dawadiaspora/
├── server.js                 # Point d'entrée
├── migrations/
│   └── 001_init.sql          # Schéma complet de la base de données
├── locales/                  # Traductions interface (en, ar, fr, rw, sw)
├── src/
│   ├── config/
│   │   ├── db.js             # Connexion PostgreSQL
│   │   └── i18n.js           # Configuration multilingue
│   ├── middleware/
│   │   └── auth.js           # Vérification JWT
│   ├── routes/
│   │   ├── auth.js           # Inscription / connexion
│   │   ├── courses.js        # Cours, leçons, contenu, progression
│   │   ├── payments.js       # Stripe : achats, abonnements, dons
│   │   └── faq.js            # Questions/Réponses par catégorie
│   └── utils/
│       └── runMigrations.js  # Exécute les fichiers .sql du dossier migrations/
└── public/                    # Fichiers statiques (frontend, à venir)
```

## Prochaines étapes

- [ ] Frontend (pages HTML/EJS ou React) avec design élégant + sélecteur de langue + support RTL
- [ ] Panel d'administration pour ajouter cours/leçons/contenu FAQ
- [ ] Intégration stockage cloud (Bunny.net / Cloudflare R2) pour les fichiers vidéo/audio lourds
- [ ] Récupération du contenu existant depuis l'ancien WordPress (logo, éventuel audio déjà uploadé)
- [ ] Configuration Stripe (produits, prix mensuel/annuel, webhook en production)
- [ ] Déploiement sur Hostinger via GitHub (option Node.js)

## Notes importantes

- Les leçons se débloquent **une par une** : la 1ère leçon d'un cours acheté est automatiquement débloquée, les suivantes se débloquent quand l'utilisateur clique "Marquer comme terminé".
- L'accès à un cours est valide si l'utilisateur a **acheté ce cours individuellement** OU a un **abonnement actif** (les deux options coexistent).
- La langue par défaut de l'interface est l'**anglais**, avec bascule possible vers arabe (RTL), français, kinyarwanda, swahili.
