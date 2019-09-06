import mongoose from 'mongoose';
import { DATABASE } from '../globals';

mongoose
  .connect(DATABASE, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error(err, 'Could not connect to MongoDB...'));

mongoose.Promise = global.Promise;

export default mongoose;
