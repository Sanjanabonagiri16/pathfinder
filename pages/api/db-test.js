import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      
      // Attempt to insert a test document
      const testCollection = db.collection('test_connection');
      const result = await testCollection.insertOne({ 
        test: 'Database connection test', 
        timestamp: new Date() 
      });

      // Attempt to read the inserted document
      const insertedDocument = await testCollection.findOne({ _id: result.insertedId });

      res.status(200).json({ 
        message: 'Database connection successful', 
        insertedId: result.insertedId,
        insertedDocument: insertedDocument
      });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ 
        message: 'Error connecting to database', 
        error: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}