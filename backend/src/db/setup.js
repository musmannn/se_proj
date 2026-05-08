import 'dotenv/config';
import { runMigrations, seedDatabaseIfEmpty } from './database.js';

async function setup() {
  try {
    console.log('Running migrations...');
    await runMigrations();
    console.log('Migrations completed.');

    console.log('Seeding database...');
    await seedDatabaseIfEmpty();
    console.log('Seed completed.');

    console.log('Database setup finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();
