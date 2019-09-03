import mongoose from '../database/index.js';

const ImageSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image: {
    type: String,
    require: true,
  },
  authorId: {
    type: String,
    required: true,
  }
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
