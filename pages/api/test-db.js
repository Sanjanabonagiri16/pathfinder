import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = await db.collection('test');
    const result = await collection.insertOne({ test: 'Hello, MongoDB!' });
    res.status(200).json({ message: 'Database connection successful', result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Error connecting to database', error: error.message });
  }
}