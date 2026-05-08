import 'dotenv/config';
import { seedDatabaseIfEmpty } from './database.js';

seedDatabaseIfEmpty()
  .then(() => {
    console.log('Database seed completed');
  })
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exit(1);
  });
