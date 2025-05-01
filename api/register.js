import { db, usersCollection } from '../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const snapshot = await usersCollection.where("email", "==", email).get();
    if (!snapshot.empty)
      return res.status(400).json({ message: 'User already exists' });

    await usersCollection.add({ name, email, password });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
