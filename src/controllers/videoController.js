import express from 'express';
import Video from '../models/video';

const router = express.Router();

// creates a new video annotation
router.post('/', async (req, res) => {
  try {
    const videoCreated = await Video.create(req.body);
    return res.status(200).send({ message: 'video saved!', videoCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

// returns 5 videos per page
router.get('/:page', async (req, res) => {
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

router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { selectedPerson } = req.body;

    const video = await Video.findOneAndUpdate(
      { _id: id },
      { selectedPerson },
      { new: true }
    );

    return res.status(200).send({ video });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
