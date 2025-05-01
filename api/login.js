import { usersCollection } from '../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const snapshot = await usersCollection
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    if (snapshot.empty)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = snapshot.docs[0].data();
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
