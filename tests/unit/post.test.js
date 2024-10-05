const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a fragment creation response
  test('authenticated users can create a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .set('Content-Length', '9')
      .send('test data');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toHaveProperty('id');
    expect(res.body.fragments).toHaveProperty('ownerId');
    expect(res.body.fragments).toHaveProperty('type', 'text/plain');
    expect(res.body.fragments).toHaveProperty('size', 9);
  });
});
