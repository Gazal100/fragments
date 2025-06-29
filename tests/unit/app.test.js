const request = require('supertest');

const app = require('../../src/app');

describe('App 404 handler', () => {
  test('should return a 404 error for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
