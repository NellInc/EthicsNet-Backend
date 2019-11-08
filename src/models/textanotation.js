import mongoose from '../database/index.js';

const TextAnotationSchema = new mongoose.Schema({
  // keep this for compatibility
  category: {
    type: String,
    require: false,
    default: '',
    lowercase: true,
  },
  font: {
    type: String,
    default: 'none',
  },
  content: {
    type: String,
    require: true,
    lowercase: true,
  },
  authorId: {
    type: String,
    required: true,
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

const TextAnotation = mongoose.model('TextAnotation', TextAnotationSchema);

export default TextAnotation;
