const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    console.log(`Exécution de la migration : ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await db.query(sql);
      console.log(`✔ ${file} appliquée avec succès`);
    } catch (err) {
      console.error(`✘ Erreur lors de ${file} :`, err.message);
      process.exit(1);
    }
  }

  console.log('Toutes les migrations ont été appliquées.');
  process.exit(0);
}

runMigrations();
