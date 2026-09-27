module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  // Tests talk to the Firestore emulator (see npm test); run suites serially
  // so they do not race on the shared emulator database.
  maxWorkers: 1,
  collectCoverageFrom: ['src/**/*.js', '!src/database/**']
};
