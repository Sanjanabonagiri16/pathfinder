import { connectToDatabase } from '../../utils/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateLoginInput } from '../../utils/validation';
import { validateCSRFToken } from '../../utils/csrf';
import rateLimit from '../../utils/rateLimit';

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const csrfToken = req.headers['x-csrf-token'];
    if (!validateCSRFToken(req, csrfToken)) {
      return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    try {
      // Apply rate limiting
      await limiter.check(res, 10, 'CACHE_TOKEN'); // 10 requests per 15 minutes

      const { email, password } = req.body;

      // Validate input
      const { error } = validateLoginInput(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { db } = await connectToDatabase();

      // Find the user
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create access token
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Create refresh token
      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Save refresh token to database
      await db.collection('refreshTokens').insertOne({
        userId: user._id,
        token: refreshToken,
        createdAt: new Date(),
      });

      // Set refresh token in HTTP-only cookie
      res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60 * 1000}`);

      res.status(200).json({ accessToken, userId: user._id });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}