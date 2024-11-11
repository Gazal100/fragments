// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/12345').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments12345')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('should return a fragment data when a valid ID is provided', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is data');

    var id = JSON.parse(res.text).fragments.id;
    const res2 = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res2.body).toHaveProperty('fragment');
  });

  // Test authenticated request with an invalid fragment ID
  test('authenticated users receive 404 for non-existent fragment ID', async () => {
    const invalidFragmentId = 'non_existent_id';
    const res = await request(app)
      .get(`/v1/fragments/${invalidFragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Fragment not Found');
  });
});
