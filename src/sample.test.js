import app from './app';
import supertest from 'supertest';

const request = supertest(app)

describe('get endpoints', () => {
  it('gets the test endpoint', async done => {
    const response = await request.get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('ok');
    done();
  });
});
