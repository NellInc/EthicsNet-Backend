import express from 'express';
import User from '../models/user';

const router = express.Router();

// returns the user data
router.get('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // user cannot update their admin role
    // must to that manually --
    delete req.body.isAdmin;
    console.log(typeof req.body);
    console.log(req.body);

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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ _id: id });
    return res.status(200).send({ user });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internet server error' });
  }
});

// Updates an user image
router.put('/image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.updateOne(
      { _id: id },
      {
        cachedImg: req.body.cachedImg,
        imageFont: req.body.imageFont,
      }
    );

    const updatedUser = await User.findOne({ _id: id });
    return res.status(200).send({ updatedUser });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// Updates an user video
router.put('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.updateOne(
      { _id: id },
      {
        cachedVideo: req.body.cachedVideo,
      }
    );
    const updatedUser = await User.findOne({ _id: id });
    return res.status(200).send({ updatedUser });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
