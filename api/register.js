const { db, usersCollection } = require('./firebase');

const allowCors = fn => async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Continue to the actual request handler
  return await fn(req, res);
};

const handler = async (req, res) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

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
};

module.exports = allowCors(handler);