import { NextResponse } from 'next/server';

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateCSRFToken() {
  return generateRandomString(32);
}

export function setCSRFToken(response) {
  const token = generateCSRFToken();
  response.cookies.set('XSRF-TOKEN', token, { 
    path: '/', 
    httpOnly: true, 
    sameSite: 'strict'
  });
  return token;
}

export function validateCSRFToken(request, token) {
  const cookieToken = request.cookies.get('XSRF-TOKEN')?.value;
  return cookieToken === token;
}