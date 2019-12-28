import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PORT } from './globals';
import morgan from 'morgan';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);
app.use(cors());
// app.use(morgan(':method :status :res[content-length] - :response-time ms'));
app.use(morgan('dev'));

import auth from './controllers/authController.js';
import authMiddleware from './middlewares/auth.js';
import apiRoutes from './controllers/textAnotateController';

import adminMiddleware from './middlewares/admin';
import userRoutes from './controllers/userController';
import textRoutes from './controllers/textController';
import imageRoutes from './controllers/imageController';
import videoRoutes from './controllers/videoController';
import adminRoutes from './controllers/adminController';

function blah(req, res, next) {
  console.log(req.body);
  console.log('yey, im a middleware!!');
  // next();
  console.log('hanging forever!');

  res.status(301).send({ error: 'please move this route' });
}

app.get('/healthcheck', async (req, res) => {
  return res.status(200).send({ msg: 'ok' });
});

app.use('/auth', auth);
app.use('/api', authMiddleware, apiRoutes);

app.use('/api2/user', authMiddleware, userRoutes);
app.use('/api2/text', authMiddleware, textRoutes);
app.use('/api2/image', authMiddleware, imageRoutes);
app.use('/api2/video', authMiddleware, videoRoutes);
app.use('/api2/admin', adminMiddleware, adminRoutes);

app.get('/', (req, res) => {
  // throw new Error('error')

  res.json({
    message:
      'this is the ethics net api! :) check out out the routes! PORT -> ' +
      PORT,
  });
});

// TODO: change this to 5000 when on deployment

export default app;
// module.exports = app;
// app.listen(80, () => console.log('api is working usually on port 80'));

// its better to blow up a home than continue with one unworth the name
// cada um colhe o que planta?
