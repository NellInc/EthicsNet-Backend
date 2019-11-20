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
  contentAction: {
    type: Number,
    required: true,
    default: 50,
  },
  toneForm: {
    type: Number,
    required: true,
    default: 50,
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
