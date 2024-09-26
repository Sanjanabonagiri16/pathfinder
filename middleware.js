import { NextResponse } from 'next/server';
import { setCSRFToken, validateCSRFToken } from './utils/csrf';

export function middleware(request) {
  const response = NextResponse.next();

  if (request.method === 'GET') {
    setCSRFToken(response);
  } else if (request.method === 'POST') {
    const token = request.headers.get('X-CSRF-Token');
    if (!validateCSRFToken(request, token)) {
      return new NextResponse(JSON.stringify({ message: 'Invalid CSRF token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};