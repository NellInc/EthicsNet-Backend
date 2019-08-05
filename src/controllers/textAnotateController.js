import express from 'express';
import User from '../models/user.js';
import TextAnotation from '../models/textanotation.js';

const router = express.Router();

router.get('/post-text', (req, res) => {
  res.send({
    ok: true,
    user: req.user,
    bla: req.bla,
  });
});

router.post('/post-text', async (req, res) => {
  console.log('post text route *_*');

  try {
    // res.send({
    //   ok: true,
    //   user: req.user,
    //   bla: req.bla,
    // });

    console.log('\n\ntext to data -> ', req.body);

    const textCreated = await TextAnotation.create(req.body);

    return res.status(200).send({ message: 'text anotated!', textCreated });

    //
  } catch (error) {
    console.log(error);

    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
