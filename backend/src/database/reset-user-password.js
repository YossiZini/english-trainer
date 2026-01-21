const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function resetPassword(username, newPassword) {
  if (!username || !newPassword) {
    console.error('❌ Usage: node reset-user-password.js <username> <new-password>');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
  }

  console.log(`🔄 Resetting password for user: ${username}...`);

  try {
    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE name = $2',
      [passwordHash, username]
    );

    if (result.rowCount === 0) {
      console.error(`❌ User "${username}" not found`);
      process.exit(1);
    }

    console.log(`✅ Password successfully reset for user: ${username}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to reset password:', error.message);
    process.exit(1);
  }
}

// Get command line arguments
const [,, username, newPassword] = process.argv;
resetPassword(username, newPassword);
