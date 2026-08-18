const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../../locales/{{lng}}.json'),
    },
    fallbackLng: 'en',
    preload: ['en', 'ar', 'fr', 'rw', 'sw'],
    detection: {
      order: ['cookie', 'querystring', 'header'],
      caches: ['cookie'],
      lookupCookie: 'dd_lang',
    },
  });

// Langues RTL - utilisé côté frontend pour inverser le layout
const RTL_LANGUAGES = ['ar'];

module.exports = { i18next, middleware, RTL_LANGUAGES };
