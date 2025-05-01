const cors = require('cors');
const { db, usersCollection } = require('./firebase');

// Configure CORS middleware
const corsMiddleware = cors({
  origin: 'http://localhost:5173',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
});

const register = async (req, res) => {
  // First apply CORS middleware
  corsMiddleware(req, res, async () => {
    // Handle OPTIONS (preflight) requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Only process POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

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
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
};

module.exports = register;