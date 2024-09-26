import { NextResponse } from 'next/server';
import { generateCSRFToken } from '../../utils/csrf';

export default function handler(req, res) {
  const token = generateCSRFToken();
  const response = NextResponse.json({ csrfToken: token });
  response.cookies.set('XSRF-TOKEN', token, { 
    path: '/', 
    httpOnly: true, 
    sameSite: 'strict'
  });
  return response;
}