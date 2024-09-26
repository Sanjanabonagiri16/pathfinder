import { useState, useEffect } from 'react';

export function useCSRF() {
  const [csrfToken, setCSRFToken] = useState('');

  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCSRFToken(data.csrfToken));
  }, []);

  return csrfToken;
}