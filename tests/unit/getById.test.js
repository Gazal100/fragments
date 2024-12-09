const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');


describe('GET /v1/fragments/:id', () => {
  let fragmentId;

  beforeAll(() => {
    fragmentId = 'validFragmentId.txt';
  });

  test('unauthenticated requests are denied', () => 
    request(app).get(`/v1/fragments/${fragmentId}`).expect(401));

  test('incorrect credentials are denied', () =>
    request(app).get(`/v1/fragments/${fragmentId}`).auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users can retrieve fragment data with valid conversion (text/plain)', async () => {
    // Simulate valid fragment data
    const fragment_data = {
      id: fragmentId,
      mimeType: 'text/plain',
      formats: ['text/plain'],
      getData: async () => 'sample text data',
    };

    // Override Fragment.byId to return the simulated fragment data
    Fragment.byId = jest.fn().mockResolvedValue(fragment_data);

    const res = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('text/plain; charset=utf-8');
    expect(res.text).toBe('sample text data');
  });

  test('authenticated users get 404 error if fragment not found', async () => {
    // Simulate that fragment does not exist
    Fragment.byId = jest.fn().mockResolvedValue(null);  // Fragment not found

    const res = await request(app)
      .get(`/v1/fragments/nonexistentId.txt`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Fragment not Found');
  });

});
