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

app.use('/auth', auth);
app.use('/projects', authMiddleware, routes);
app.use('/api', authMiddleware, apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'hello world!',
  });
});

app.listen(5000, () => console.log('magic happens on port 5000'));
