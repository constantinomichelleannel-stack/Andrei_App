
import fetch from 'node-fetch';

async function testApis() {
  const endpoints = [
    '/api/health',
    '/api/notes',
    '/api/documents'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000${endpoint}`);
      const data = await res.json();
      console.log(`Endpoint ${endpoint}:`, res.status, JSON.stringify(data).substring(0, 100));
    } catch (err) {
      console.error(`Endpoint ${endpoint} failed:`, err.message);
    }
  }
}

testApis();
