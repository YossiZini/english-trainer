const { Firestore } = require('@google-cloud/firestore');

/**
 * Firestore client.
 *
 * - On Cloud Run it authenticates as the service's runtime service account
 *   through Application Default Credentials; no key file is involved.
 * - In tests, FIRESTORE_EMULATOR_HOST points the client at the emulator.
 */
let client = null;

function getFirestore() {
  if (!client) {
    client = new Firestore({
      projectId: process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined,
      ignoreUndefinedProperties: true
    });
  }
  return client;
}

module.exports = { getFirestore };
