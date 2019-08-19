import express from 'express';
import User from '../models/user.js';
import TextAnotation from '../models/textanotation.js';

const router = express.Router();

// TODO: implement authorization

router.get('/post-text', (req, res) => {
  res.send({
    ok: true,
    user: req.user,
    bla: req.bla,
  });
});

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

router.get('/user', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    return res.status(200).send({ message: 'user found!', user });

    //
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.get('/user/anotations', async (req, res) => {
  try {
    const anotations = await TextAnotation.find({
      authorId: req.userId,
    });

    return res.status(200).send({ anotations });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.get('/user/anotations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const anotation = await TextAnotation.findById(id);

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

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

router.put('/user/image/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      {_id: id},
      {cachedImg: req.body},
      {new: true}
    )

  } catch(error) {
    return res.status(500).send({error: 'internal server error'});
  }
});

router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    return res.status(200).send({ user });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }

});

export default router;
