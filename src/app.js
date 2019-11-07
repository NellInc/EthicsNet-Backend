import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PORT } from './globals';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
app.use(cors());

import auth from './controllers/authController.js';
import authMiddleware from './middlewares/auth.js';
import apiRoutes from './controllers/textAnotateController';

import userRoutes from './controllers/userController';
import textRoutes from './controllers/textController';
import imageRoutes from './controllers/imageController';
import videoRoutes from './controllers/videoController';

function blah(req, res, next) {
  console.log(req.body);
  console.log('yey, im a middleware!!');
  // next();
  console.log('hanging forever!');

  res.status(301).send({ error: 'please move this route' });
}

app.use('/auth', auth);
app.use('/api', authMiddleware, apiRoutes);

app.use('/api2/user', authMiddleware, userRoutes);
app.use('/api2/text', authMiddleware, textRoutes);
app.use('/api2/image', authMiddleware, imageRoutes);
app.use('/api2/video', authMiddleware, videoRoutes);

app.get('/', (req, res) => {

  // throw new Error('error')

  res.json({
    message:
      'this is the ethics net api! :) check out out the routes! PORT -> ' + PORT,
  });
});

// TODO: change this to 5000 when on deployment
app.listen(80, () =>
  console.log('api is working usually on port 80')
);
