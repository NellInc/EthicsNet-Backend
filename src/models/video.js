import mongoose from '../database/index.js';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    require: true,
  },
  videoStart: {
    type: String,
    require: true,
  },
  videoEnd: {
    type: String,
    require: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  selectedPerson: {
    type: String,
    default: '',
  },
});

const Video = mongoose.model('Video', VideoSchema);

export default Video;
