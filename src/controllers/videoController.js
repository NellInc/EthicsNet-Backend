import express from 'express';
import Video from '../models/video';

// Only schema fields may be supplied by clients; ownership is server-managed.
const editableFields = ['title', 'description', 'videoUrl', 'videoStart', 'videoEnd', 'category', 'contentAction', 'toneForm', 'createdAt', 'selectedPerson'];
const editableData = (body) =>
  editableFields.reduce((data, field) => {
    if (body && Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
    return data;
  }, {});

const router = express.Router();

// creates a new video annotation
router.post('/', async (req, res) => {
  try {
    const videoCreated = await Video.create({ ...editableData(req.body), authorId: req.userId });
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

    const count = await Video.find({ authorId: req.userId }).count();

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
      { _id: id, authorId: req.userId },
      { $set: { selectedPerson } },
      { new: true }
    );

    return res.status(200).send({ video });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOneAndUpdate({ _id: id, authorId: req.userId }, { $set: editableData(req.body) }, {
      new: true,
    });

    return res.status(200).send({ video });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.deleteOne({ _id: id, authorId: req.userId });

    return res.status(200).send({ video });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server errror' });
  }
});

export default router;
