import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ ok: true, user: req.user, bla: req.bla });
});

export default router;
