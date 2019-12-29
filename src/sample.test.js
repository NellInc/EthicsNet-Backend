import app from './app';
import supertest from 'supertest';
import mongoose from 'mongoose';

jest.setTimeout(30000);

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
        email: 'emerson99@gmail.com',
        password: '123',
        lastName: 'Lopes',
        firstName: 'Emerson',
      });

    expect(response.statusCode).toEqual(200);
    mongoose.connection.db.dropDatabase();
    done();
  });

  it('should not add two users with the same email', async done => {
    const response = await request
      // .get('/healthcheck')
      .post('/auth/register')
      .send({
        email: 'emerson99@gmail.com',
        password: '123',
        lastName: 'Lopes',
        firstName: 'Emerson',
      });

    expect(response.statusCode).toEqual(200);

    const response2 = await request
      // .get('/healthcheck')
      .post('/auth/register')
      .send({
        email: 'emerson99@gmail.com',
        password: '123',
        lastName: 'Lopes',
        firstName: 'Emerson',
      });

    expect(response2.statusCode).toEqual(400);
    expect(response2.body.error).toBe('user already exists')

    mongoose.connection.db.dropDatabase();
    done();
  });

  it('should throw an error if no email is provided', async done => {
    const response = await request.post('/auth/register').send({
      email: '',
      password: '123',
      lastName: 'Lopes',
      firstName: 'Emerson',
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.errorMessage).toBe(
      'User validation failed: email: Path `email` is required.'
    );

    mongoose.connection.db.dropDatabase();
    done();
  });

  it('should throw an error if no firstName is provided', async done => {
    const response = await request.post('/auth/register').send({
      email: 'emerson1@gmail.com',
      password: '123',
      lastName: 'Lopes',
      firstName: '',
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.errorMessage).toBe(
      'User validation failed: firstName: Path `firstName` is required.'
    );
    mongoose.connection.db.dropDatabase();
    done();
  });

  it('should throw an error if no lastName is provided', async done => {
    const response = await request.post('/auth/register').send({
      email: 'emerson2@gmail.com',
      password: '123',
      lastName: '',
      firstName: 'Emerson',
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.errorMessage).toBe(
      'User validation failed: lastName: Path `lastName` is required.'
    );
    mongoose.connection.db.dropDatabase();
    done();
  });

  it('should throw an error if no password is provided', async done => {
    const response = await request.post('/auth/register').send({
      email: 'emerson3@gmail.com',
      password: '',
      lastName: 'Lopes',
      firstName: 'Emerson',
    });
    expect(response.statusCode).toEqual(400);
    expect(response.body.errorMessage).toBe(
      'User validation failed: password: Path `password` is required.'
    );
    mongoose.connection.db.dropDatabase();
    done();
  });
});
