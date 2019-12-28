import app from './app';
import supertest from 'supertest';
import mongoose from 'mongoose';

const request = supertest(app);

describe('get endpoints', () => {
  it('gets the healthcheck endpoint', async done => {
    const response = await request.get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('ok');
    done();
  });

  it('should create a new user', async done => {
    const response = await request
      // .get('/healthcheck')
      .post('/auth/register')
      .send({
        email: 'emerson@gmail.com',
        password: '123',
        lastName: 'Lopes',
        firstName: 'Emerson',
      });

    expect(response.statusCode).toEqual(200);

    // console.log('====================================');
    // console.log('response.body from tests -> ', response.body);
    // console.log('====================================');

    // drop database
    mongoose.connection.db.dropDatabase();
    // const { _id } = response;
    done();
  });

  // it('should log user in', async done => {
  //   const response = await request
  //     .get('/auth/login');
      
  // })


});
