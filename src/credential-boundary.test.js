import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import vm from 'vm';
import fs from 'fs';
import path from 'path';
import * as babel from '@babel/core';

jest.mock('./database/index.js', () => require('mongoose'));
process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
const secret = process.env.JWT_SECRET;
const User = require('./models/user').default;
const Image = require('./models/images').default;
const Video = require('./models/video').default;
const Text = require('./models/textanotation').default;
const auth = require('./controllers/authController').default;
const account = require('./controllers/userController').default;
const legacy = require('./controllers/textAnotateController').default;
const images = require('./controllers/imageController').default;
const videos = require('./controllers/videoController').default;
const texts = require('./controllers/textController').default;
const authMiddleware = require('./middlewares/auth').default;
const adminMiddleware = require('./middlewares/admin').default;
const { publicUserUpdate } = require('./helpers/userInput');
const castUserUpdate = User.findOneAndUpdate.bind(User);
const ownId = '507f1f77bcf86cd799439011';
const otherId = '507f1f77bcf86cd799439012';
const app = express();
app.use(express.json());
app.use('/auth', auth);
app.use((req, res, next) => { req.userId = ownId; next(); });
app.use('/account', account);
app.use('/legacy', legacy);
app.use('/images', images);
app.use('/videos', videos);
app.use('/texts', texts);
const server = app.listen(0, '127.0.0.1');
beforeAll(done => server.listening ? done() : server.once('listening', done));
afterAll(done => server.close(done));

beforeEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(User, 'findOne').mockResolvedValue(null);
  jest.spyOn(User, 'create').mockImplementation(async data => {
    const user = new User(data);
    await user.validate();
    return user;
  });
  for (const Model of [User, Image, Video, Text]) {
    jest.spyOn(Model, 'findOneAndUpdate').mockResolvedValue(null);
    jest.spyOn(Model, 'updateOne').mockResolvedValue({ n: 0 });
    jest.spyOn(Model, 'deleteOne').mockResolvedValue({ deletedCount: 0 });
    jest.spyOn(Model, 'remove').mockResolvedValue({ deletedCount: 0 });
    if (Model !== User) jest.spyOn(Model, 'create').mockResolvedValue({});
  }
  jest.spyOn(User, 'findById').mockResolvedValue(null);
});

test.each([undefined, '', '   ', 'short', ' '.repeat(40)])('invalid signing configuration fails closed: %p', value => {
  const source = fs.readFileSync(path.join(__dirname, 'config/auth.js'), 'utf8');
  const code = babel.transformSync(source, { configFile: false, presets: ['@babel/preset-env'] }).code;
  const module = { exports: {} };
  expect(() => vm.runInNewContext(code, { process: { env: { JWT_SECRET: value } }, Buffer, module, exports: module.exports }))
    .toThrow('JWT_SECRET must be configured');
});

test('ordinary signup keeps its response and never grants the requested admin role', async () => {
  const response = await request(server).post('/auth/register').send({
    firstName: 'Test', lastName: 'User', email: 'synthetic@example.invalid',
    password: 'test-only-password', isAdmin: true, _id: otherId,
  });
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Welcome to EthicsNet!');
  expect(response.body.user.password).toBeUndefined();
  expect(response.body.user.isAdmin).toBe(false);
  expect(response.body.user._id).not.toBe(otherId);
  expect(jwt.verify(response.body.token, secret).isAdmin).toBe(false);
});

test('duplicate and validation error responses remain intact', async () => {
  User.findOne.mockResolvedValueOnce({});
  const duplicate = await request(server).post('/auth/register').send({ email: 'synthetic@example.invalid' });
  expect(duplicate.status).toBe(400);
  expect(duplicate.body.error).toBe('user already exists');
  const invalid = await request(server).post('/auth/register').send({ email: '' });
  expect(invalid.status).toBe(400);
  expect(invalid.body.error).toBe('registration failed');
});

test('successful login keeps its token claims and password-free response', async () => {
  const user = { _id: ownId, isAdmin: false, password: await bcrypt.hash('test-only-password', 10) };
  const query = { select: jest.fn() };
  query.select.mockReturnValueOnce(query).mockResolvedValueOnce(user);
  User.findOne.mockReturnValueOnce(query);
  User.findById.mockResolvedValueOnce({ firstName: 'Test', password: user.password });
  const response = await request(server).post('/auth/authenticate').send({ email: 'synthetic@example.invalid', password: 'test-only-password' });
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Welcome back Test');
  expect(response.body.user.password).toBeUndefined();
  expect(jwt.verify(response.body.token, secret).id).toBe(ownId);
});

test.each([authMiddleware, adminMiddleware])('both verifiers reject forged tokens and accept configured claims', middleware => {
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const next = jest.fn();
  middleware({ headers: { authorization: 'Bearer ' + jwt.sign({ id: ownId, isAdmin: true }, crypto.randomBytes(32).toString('hex')) } }, res, next);
  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(401);
  middleware({ headers: { authorization: 'Bearer ' + jwt.sign({ id: ownId, isAdmin: true }, secret) } }, res, next);
  expect(next).toHaveBeenCalledTimes(1);
});

test('a legitimate non-admin token is denied admin access', () => {
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const next = jest.fn();
  adminMiddleware({ headers: { authorization: 'Bearer ' + jwt.sign({ id: ownId, isAdmin: false }, secret) } }, res, next);
  expect(next).not.toHaveBeenCalled();
  expect(res.send).toHaveBeenCalledWith({ error: 'user is not an admin' });
});

test.each(['/account/', '/account/image/', '/account/video/', '/legacy/user/', '/legacy/user/image/', '/legacy/user/video/'])
('cross-account update is denied before any mutation: %s', async prefix => {
  const response = await request(server).put(prefix + otherId).send({ password: 'test-only-password', isAdmin: true });
  expect(response.status).toBe(403);
  expect(User.findOneAndUpdate).not.toHaveBeenCalled();
  expect(User.updateOne).not.toHaveBeenCalled();
});

test('cross-account deletion never removes accounts or their records', async () => {
  expect((await request(server).delete('/account/' + otherId)).status).toBe(403);
  for (const Model of [User, Image, Video, Text]) expect(Model.remove).not.toHaveBeenCalled();
});

test.each(['/account/', '/legacy/user/'])('profile aliases share safe updates and hash passwords: %s', async prefix => {
  expect((await request(server).put(prefix + ownId).send({ firstName: 'New', password: 'test-only-password', isAdmin: true })).status).toBe(200);
  const [filter, update] = User.findOneAndUpdate.mock.calls[0];
  expect(filter).toEqual({ _id: ownId });
  expect(update.$set.firstName).toBe('New');
  expect(update.$set.isAdmin).toBeUndefined();
  expect(await bcrypt.compare('test-only-password', update.$set.password)).toBe(true);
  User.findOneAndUpdate.mockClear();
  await request(server).put(prefix + ownId).send({ $set: { isAdmin: true }, 'isAdmin.value': true });
  expect(User.findOneAndUpdate).not.toHaveBeenCalled();
});

test('actual Mongoose casting preserves the safe hash and excludes privilege fields', async () => {
  const update = await publicUserUpdate({ password: 'test-only-password', isAdmin: true });
  const query = castUserUpdate({ _id: ownId }, update);
  const cast = query._castUpdate(query.getUpdate());
  expect(cast.$set.isAdmin).toBeUndefined();
  expect(await bcrypt.compare('test-only-password', cast.$set.password)).toBe(true);
});

test.each([
  ['/images/item', Image], ['/videos/edit/item', Video], ['/videos/update/item', Video],
  ['/texts/item', Text], ['/legacy/user/anotations/item', Text],
])('resource updates atomically scope ownership: %s', async (url, Model) => {
  await request(server).put(url).send({ title: 'test', content: 'test', selectedPerson: 'test', authorId: otherId, $set: { authorId: otherId }, 'authorId.value': otherId });
  const [filter, update] = Model.findOneAndUpdate.mock.calls[0];
  expect(filter).toEqual({ _id: 'item', authorId: ownId });
  expect(update.$set.authorId).toBeUndefined();
  expect(update.$set.$set).toBeUndefined();
  expect(update.$set['authorId.value']).toBeUndefined();
});

test.each([
  ['/images/item', Image], ['/videos/item', Video], ['/texts/item', Text],
  ['/legacy/user/images/item', Image], ['/legacy/user/anotations/item', Text],
])('resource deletion atomically scopes ownership: %s', async (url, Model) => {
  await request(server).delete(url);
  expect(Model.deleteOne).toHaveBeenCalledWith({ _id: 'item', authorId: ownId });
});

test.each([
  ['/images', Image], ['/videos', Video], ['/texts', Text],
  ['/legacy/image', Image], ['/legacy/video', Video], ['/legacy/post-text', Text],
])('creation always binds the authenticated owner: %s', async (url, Model) => {
  await request(server).post(url).send({ title: 'test', content: 'test', authorId: otherId });
  expect(Model.create.mock.calls[0][0].authorId).toBe(ownId);
});
