/**
 * Reset a student's password in Firestore.
 *
 * Runs against the production database with your own credentials:
 *   gcloud auth application-default login
 *   GCP_PROJECT_ID=teacher-509909 npm run reset-password -- <username> <new-password>
 */
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

async function resetPassword(username, newPassword) {
  if (!username || !newPassword) {
    console.error('Usage: npm run reset-password -- <username> <new-password>');
    process.exit(1);
  }
  if (newPassword.length < 6) {
    console.error('Password must be at least 6 characters long');
    process.exit(1);
  }

  const user = await db.findOne('users', { name: username });
  if (!user) {
    console.error(`User "${username}" not found`);
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(newPassword, 10);
  await db.updateById('users', user.id, { password_hash });
  console.log(`Password reset for "${username}"`);
}

resetPassword(process.argv[2], process.argv[3])
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error.message);
    process.exit(1);
  });
