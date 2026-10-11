import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtSecret from '../config/auth';
import { publicUserInput } from '../helpers/userInput';

const router = express.Router();

// whats unique about your user model
// and a secret key
function generateToken(params = {}) {
  return jwt.sign(params, jwtSecret, {
    expiresIn: '30d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'user already exists' });
    }
    const user = await User.create({ ...publicUserInput(req.body), isAdmin: false });

    // so the password doesnt get sent back on the response
    user.password = undefined;

    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });

    // res.send({ user, token });
    return res.status(200).send({ user, token, message: 'Welcome to EthicsNet!' });
  } catch (error) {
    return res.status(400).send({ error: 'registration failed', errorMessage: error.message });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .select('password')
    .select('isAdmin');

  if (!user) {
    return res.status(400).send({ error: 'user not found' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'invalid password' });
  }

  const fullUser = await User.findById(user._id);

  if (!fullUser) {
    return res.status(400).send({ error: 'full user not found' });
  }

  fullUser.password = undefined;

  const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
  res.send({ user: fullUser, token, message: 'Welcome back ' + fullUser.firstName });
});

router.get('/email/:email', async (req, res) => {
  // return res.status(200).send({ message: 'Welcome to EthicsNet!' });
  const { email } = req.params;

  if (await User.findOne({ email })) {
    return res.status(400).send({ error: 'User already exists' });
  }

  return res.status(200).send({ message: 'ok' });
});

export default router;
