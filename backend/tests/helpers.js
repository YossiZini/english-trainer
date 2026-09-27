/**
 * Shared test setup. Tests run against the Firestore emulator; `npm test`
 * starts it and sets FIRESTORE_EMULATOR_HOST before Jest runs.
 */
if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Tests need the Firestore emulator. Run them with `npm test`.');
}
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || 'demo-english-trainer';

const { db, DYNAMIC_COLLECTIONS, initializeDatabase, shutdownDatabase } = require('../src/config/database');

async function resetDatabase() {
  await initializeDatabase();
  await db.clearCollections(DYNAMIC_COLLECTIONS);
}

module.exports = { db, DYNAMIC_COLLECTIONS, initializeDatabase, shutdownDatabase, resetDatabase };
