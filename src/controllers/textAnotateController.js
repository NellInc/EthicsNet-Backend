import express from 'express';
import User from '../models/user.js';
import TextAnotation from '../models/textanotation.js';
import Image from '../models/images';
import Video from '../models/video';

const router = express.Router();

// TODO: implement authorization

router.get('/post-text', (req, res) => {
  res.send({
    ok: true,
    user: req.user,
    bla: req.bla,
  });
});

// MOVED
router.post('/image', async (req, res) => {
  try {
    const imageCreated = await Image.create(req.body);
    return res.status(200).send({ message: 'image saved!', imageCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.post('/video', async (req, res) => {
  try {
    const videoCreated = await Video.create(req.body);
    return res.status(200).send({ message: 'video saved!', videoCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// FIXME: MOVED
router.post('/post-text', async (req, res) => {
  try {
    const textCreated = await TextAnotation.create(req.body);
    return res.status(200).send({ message: 'text anotated!', textCreated });
    //
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// FIXME: MOVED TO USERCONTROLLER
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

// TO MOVE!!@!
router.get('/user/images/all', async (req, res) => {
  try {
    const images = await Image.find();
    return res.status(200).send({ images });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// FIXME: MOVED!
router.get('/user/videos/:page', async (req, res) => {
  try {
    const page = req.params.page || 1;
    const perPage = 5;

    const videos = await Video.find({
      authorId: req.userId,
    })
      .skip(page * perPage - perPage)
      .limit(perPage);

    const count = await Video.count();

    return res.status(200).send({ videos, count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

//  MOVED
router.get('/user/images/:page', async (req, res) => {
  try {
    const page = req.params.page || 1;
    const perPage = 10;

    const images = await Image.find({
      authorId: req.userId,
    })
      .skip(page * perPage - perPage)
      .limit(perPage);

    const count = await Image.count();

    return res.status(200).send({ images, count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.delete('/user/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const anotation = await Image.deleteOne({ _id: id });

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.get('/user/anotations/:page', async (req, res) => {
  try {
    const page = req.params.page || 1;
    const perPage = 10;

    const anotations = await TextAnotation.find({
      authorId: req.userId,
    })
      .skip(page * perPage - perPage)
      .limit(perPage);

    const count = await TextAnotation.count();

    return res.status(200).send({ anotations, count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.get('/user/anotation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const anotation = await TextAnotation.findById(id);

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.put('/user/anotations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const anotation = await TextAnotation.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// MOVED
router.delete('/user/anotations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const anotation = await TextAnotation.deleteOne({ _id: id });

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// USER ROUTE ?!? OR PLACE IT ON A DIFFERENT PLACE
router.put('/user/image/:id', async (req, res) => {
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

// USER ROUTE ?!? OR PLACE IT ON A DIFFERENT PLACE
router.put('/user/video/:id', async (req, res) => {
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

// FIXME: MOVED!
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

export default router;
