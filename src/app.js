import "@babel/polyfill";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors({credentials: true, origin: true}))
app.use(cors());

import auth from './controllers/authController.js';
import routes from './controllers/projectController.js';
import authMiddleware from './middlewares/auth.js';
import apiRoutes from './controllers/textAnotateController';
import userRoutes from './controllers/userController'

app.use('/auth', auth);
app.use('/projects', authMiddleware, routes);
app.use('/api', authMiddleware, apiRoutes);
// app.use('/api', authMiddleware, userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'this is the ethics net api! check out out the routes!',
  });
});

app.listen(5000, () => console.log('magic happens on port 5000!'));
