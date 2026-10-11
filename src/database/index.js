import mongoose from 'mongoose';
import { DATABASE } from '../globals';

// set up testing database
if (process.env.NODE_ENV === 'test') {
  mongoose
    .connect('mongodb://localhost:27017/ethics-net-test', {
      useNewUrlParser: true,
    })
    .then(() => console.log('Connected to test DB...'))
    .catch(err => console.error(err, 'Could not connect to MongoDB...'));
} else {
  mongoose
    .connect('mongodb://localhost:27017/ethics-net', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error(err, 'Could not connect to MongoDB...'));
}

mongoose.Promise = global.Promise;

export default mongoose;
