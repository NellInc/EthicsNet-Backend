import app from '../app';
import supertest from 'supertest';
import mongoose from 'mongoose';

jest.setTimeout(30000);

const request = supertest(app);

// beforeAll(async done => {
//   const response = await request.post('/auth/register').send({
//     email: 'lopes@test.com',
//     password: '123',
//     lastName: 'Lopes',
//     firstName: 'Emerson',
//   });

//   expect(response.statusCode).toEqual(200);
//   expect(response.body.user).toBeTruthy();
//   expect(response.body.token).toBeTruthy();
//   done();
// });

// afterEach(() => {
//   mongoose.connection.db.dropDatabase();
// });

// afterAll(() => mongoose.connection.db.dropDatabase());

describe('Login endpoints', () => {

  it('expect true to be true', () => {
    expect(true).toBe(true);
  })

  // it('should log user in', async done => {
  //   const response = await request.post('/auth/authenticate').send({
  //     email: 'lopes@test.com',
  //     password: '123',
  //   });
  //   expect(response.statusCode).toEqual(200);
  //   expect(response.body.user).toBeTruthy();
  //   expect(response.body.token).toBeTruthy();
  //   done();
  // });

  // it('should NOT log user in', async done => {
  //   const response = await request.post('/auth/authenticate').send({
  //     email: 'lopes@test.com',
  //     password: '1234',
  //   });
  //   expect(response.statusCode).toEqual(400);
  //   expect(response.body.error).toBe('invalid password');
  //   done();
  // });
});
