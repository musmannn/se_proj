import 'dotenv/config';
import { runMigrations } from './database.js';

runMigrations()
  .then(() => {
    console.log('Database migrations completed');
  })
  .catch((error) => {
    console.error('Database migration failed:', error);
    process.exit(1);
  });
