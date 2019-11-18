import mongoose from '../database/index.js';

const ImageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    require: true,
  },
  imageFont: {
    type: String,
    default: '',
  },
  authorId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    require: true,
    lowercase: true,
  },
  categoryRangeContentAction: {
    type: Number,
    required: true,
    default: 50,
  },
  categoryRangeToneForm: {
    type: Number,
    required: true,
    default: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
