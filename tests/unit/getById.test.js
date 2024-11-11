const request = require('supertest');

const app = require('../../src/app');

describe('GetByID /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('authenticated users get a fragments array with Correct ID', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is data');

    var id = JSON.parse(res.text).fragments.id;
    const res2 = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res2.statusCode).toBe(200);
  });

  test('Fragment with Markdown Format is Converted to HTML', async () => {

    const createFragmentResponse = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/markdown')
      .send("# This is a Markdown Title");
  
    expect(createFragmentResponse.status).toBe(201); 
  

    const id = JSON.parse(createFragmentResponse.text).fragments.id;
    const retrieveFragmentResponse = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
  
    expect(retrieveFragmentResponse.status).toBe(200);
  });
});
