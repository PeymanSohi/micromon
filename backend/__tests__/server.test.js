const request = require('supertest');
const app = require('../server');

describe('Server Tests', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  test('GET /metrics should return 200', async () => {
    const response = await request(app).get('/metrics');
    expect(response.statusCode).toBe(200);
  });

  test('GET /nonexistent should return 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
}); 