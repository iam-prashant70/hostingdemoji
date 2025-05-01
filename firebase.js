require('dotenv').config();
const admin = require('firebase-admin');

// For debugging - remove after verification
console.log('Private Key:', process.env.FIREBASE_PRIVATE_KEY);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();
const usersCollection = db.collection('users');

module.exports = { db, usersCollection };