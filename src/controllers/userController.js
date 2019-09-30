import express from 'express';
import User from '../models/user';

const router = express.Router();

router.get('/', (req, res, next) => {
  const { userId } = req;
  res.send({ message: 'user routes...', userId });
});

// returns the user data
router.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      return res.status(200).send({ message: 'user found!', user });
    }
    return res.status(404).send({ message: 'user not found!' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// Updates the user info
router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    return res.status(200).send({ user });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// Deletes an user
router.delete('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ _id: id });
    return res.status(200).send({ user });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internet server error' });
  }
});

export default router;
