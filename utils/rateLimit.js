import rateLimit from 'express-rate-limit';

export default function getRateLimitMiddleware({ limit, windowMs }) {
  return rateLimit({
    max: limit,
    windowMs,
    message: 'Too many requests, please try again later.',
  });
}