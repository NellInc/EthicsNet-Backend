import express from 'express';
import User from '../models/user';
import Text from '../models/textanotation.js';
import Image from '../models/images';
import Video from '../models/video';

const router = express.Router();

// returns the user data
router.get('/stats', async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.staus(401).send({ error: 'user is not an admin' });
    }

    const numUsers = await User.count();
    const numTexts = await Text.count();
    const numImages = await Image.count();
    const numVideos = await Video.count();

    return res.status(200).send({ numUsers, numTexts, numImages, numVideos });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'internal server error' });
  }
});

export default router;
