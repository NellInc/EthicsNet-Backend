import mongoose from '../database/index.js';

const TextAnotation = new mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TextAnotation = mongoose.model('TextAnotation', UserSchema);

export default TextAnotation;
