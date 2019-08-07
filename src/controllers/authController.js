import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// whats unique about your user model
// and a secret key
function generateToken(params = {}) {
  return jwt.sign(params, 'secret', {
    expiresIn: '30d',
  });
}

router.post('/register', async (req, res) => {
  console.log('data -> ', req.body);

  try {
    const { email } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'user already exists' });
    }

    const user = await User.create(req.body);

    // so the password doesnt get sent back on the response
    user.password = undefined;

    const token = generateToken({ id: user._id });

    // res.send({ user, token });
    return res.status(200).send({ user, token });
  } catch (error) {
    return res.status(400).send({ error: 'registration failed' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('password');

  console.log(user);

  if (!user) {
    return res.status(400).send({ error: 'user not found' });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'invalid password' });
  }

  const fullUser = await User.findById(user._id);
  fullUser.password = undefined;

  const token = generateToken({ id: user._id });
  res.send({ user: fullUser, token });
});

export default router;
