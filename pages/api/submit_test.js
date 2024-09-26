import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const { userId, test_type, answers, score } = req.body;

      const result = await db.collection('test_results').insertOne({
        userId: ObjectId(userId),
        test_type,
        answers,
        score,
        timestamp: new Date(),
      });

      res.status(200).json({ message: 'Test results submitted successfully', id: result.insertedId });
    } catch (error) {
      console.error('Error submitting test results:', error);
      res.status(500).json({ message: 'Error submitting test results' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}