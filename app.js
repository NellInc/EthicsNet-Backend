// import express from 'express';

// // Set up the express app
// const app = express();
// // get all todos
// app.get('/api/get', (req, res) => {
//   res.status(200).send({
//     success: 'true',
//     message: 'todos retrieved successfully',
//     // todos: db
//   });
// });

// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`server running on port ${PORT}`);
// });

import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import auth from './controllers/authController.js';
import routes from './controllers/projectController.js';
import authMiddleware from './middlewares/auth.js';

app.use('/auth', auth);
app.use('/projects', authMiddleware, routes);

app.get('/', (req, res) => {
  res.json({
    message: 'hello world!',
  });
});

app.listen(5000, () => console.log('magic happens on port 5000'));
