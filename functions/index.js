const express = require('express');
const cors = require('cors');
const { db, usersCollection } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// Register
app.post("/api/register", async (req, res) => {
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

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await usersCollection
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

      console.log(snapshot); 
      
    if (snapshot.empty)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = snapshot.docs[0].data();
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


exports.api = functions.https.onRequest(app);
