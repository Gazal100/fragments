const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  let fragmentId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .set('Content-Length', '9')
      .send('test data');

    fragmentId = res.body.fragments.id;
  });

  test('unauthenticated requests are denied', () => 
    request(app).delete(`/v1/fragments/${fragmentId}`).expect(401));

  test('incorrect credentials are denied', () =>
    request(app).delete(`/v1/fragments/${fragmentId}`).auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can delete a fragment', async () => {
    const res = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    // We expect the status code to be 200 and a success status
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');  // Expect 'status' to be 'ok'
  });

});
