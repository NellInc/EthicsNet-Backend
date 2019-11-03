import express from 'express';
import Image from '../models/images';

const router = express.Router();

router.post('/', async (req, res, _next) => {
  try {
    const imageCreated = await Image.create(req.body);
    return res.status(200).send({ message: 'image saved!', imageCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// TODO: Update an image

router.put('/:id', async (req, res) => {});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const anotation = await Image.deleteOne({ _id: id });

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.get('/page/:page', async (req, res) => {
  try {
    const page = req.params.page || 1;
    const perPage = 5;

    const images = await Image.find({
      authorId: req.userId,
    })
      .skip(page * perPage - perPage)
      .limit(perPage);

    const count = await Image.find({ authorId: req.userId }).count();

    return res.status(200).send({ images, count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
