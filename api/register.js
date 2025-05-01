const { db, usersCollection } = require('./firebase');

const handler = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Main request handling
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const snapshot = await usersCollection.where("email", "==", email).get();
      if (!snapshot.empty) {
        return res.status(400).json({ message: "User already exists" });
      }

      await usersCollection.add({ name, email, password });
      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

module.exports = handler;