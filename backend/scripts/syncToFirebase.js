require('dotenv').config();
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const User = require('../src/models/User');

// Initialize Firebase Admin (matching src/config/firebase.js)
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const syncUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users in MongoDB.`);

    for (const user of users) {
      try {
        // Check if user already exists in Firebase
        try {
          const fbUser = await admin.auth().getUserByEmail(user.email);
          console.log(`User ${user.email} already exists in Firebase. Updating UID in Mongo...`);
          // Update mongo uid to match firebase if they differ
          if (user.uid !== fbUser.uid) {
             user.uid = fbUser.uid;
             await user.save();
          }
          continue;
        } catch (e) {
          if (e.code !== 'auth/user-not-found') throw e;
        }

        // Create new user in Firebase Auth
        const newUser = await admin.auth().createUser({
          email: user.email,
          password: 'HealMate@123', // Hardcoding since password hashes can't be imported easily without specific formats
          displayName: user.name,
        });

        // Update existing MongoDB user with new Firebase UID
        user.uid = newUser.uid;
        await user.save();
        
        console.log(`✅ Created ${user.email} in Firebase Auth with UID: ${newUser.uid}`);
      } catch (err) {
        console.error(`❌ Failed to create ${user.email}:`, err.message);
      }
    }
    
    console.log('Finished syncing users!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

syncUsers();
