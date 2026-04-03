const admin = require('firebase-admin');

// Ensure that we format the private key correctly.
// Depending on how it's injected through .env, newline characters might need to be parsed
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('✅ Firebase Admin Initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin Initialization Error:', error.stack);
  }
}

module.exports = admin;
