const cors = require('cors');
const { db, usersCollection } = require('./firebase');

// Create a serverless function for register
const register = async (req, res) => {
  await cors({ origin: 'http://localhost:5173' })(req, res, async () => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: "Missing fields" });

      const snapshot = await usersCollection.where("email", "==", email).get();
      if (!snapshot.empty)
        return res.status(400).json({ message: "User already exists" });

      await usersCollection.add({ name, email, password });
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
};

module.exports = register;
