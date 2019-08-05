import express from 'express';

const router = express.Router();

router.get('/data', (req, res) => {
  res.send({ ok: true, user: req.user, bla: req.bla });
});

export default router;
