const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
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
    request(app).put(`/v1/fragments/${fragmentId}`).expect(401));

  test('incorrect credentials are denied', () =>
    request(app).put(`/v1/fragments/${fragmentId}`).auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can update a fragment when content type is unchanged', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')  // Keep content type the same
      .send('updated test data');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('id', fragmentId);
    expect(res.body.fragment).toHaveProperty('type', 'text/plain');
    expect(res.body.fragment).toHaveProperty('size', 17); // Updated size based on new data
  });

  test('authenticated users are denied when trying to change fragment type', async () => {
    const res = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')  // Try to change the type
      .send('updated test data');

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');

  });

  test('attempting to update a non-existent fragment returns 404', async () => {
    const res = await request(app)
      .put('/v1/fragments/nonexistentId')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('updated test data');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Fragment not Found');
  });
});
