import express from 'express';
import Text from '../models/textanotation';

// Only schema fields may be supplied by clients; ownership is server-managed.
const editableFields = ['category', 'font', 'content', 'categoryRangeContentAction', 'categoryRangeToneForm', 'createdAt'];
const editableData = (body) =>
  editableFields.reduce((data, field) => {
    if (body && Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
    return data;
  }, {});

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const textCreated = await Text.create({ ...editableData(req.body), authorId: req.userId });
    return res.status(200).send({ message: 'text anotated!', textCreated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const anotation = await Text.findById(id);

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const anotation = await Text.findOneAndUpdate({ _id: id, authorId: req.userId }, { $set: editableData(req.body) }, {
      new: true,
    });

    return res.status(200).send({ anotation });
  } catch (error) {
    console.log('there was an error -> ', error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log('deleting annotation...');

    const anotation = await Text.deleteOne({ _id: id, authorId: req.userId });

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

    const anotations = await Text.find({
      authorId: req.userId,
    })
      .skip(page * perPage - perPage)
      .limit(perPage);

    const count = await Text.find({ authorId: req.userId }).count();

    return res.status(200).send({ anotations, count });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
