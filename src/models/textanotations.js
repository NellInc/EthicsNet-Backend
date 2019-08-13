import mongoose from '../database/index.js';


const TextAnotationSchema = new mongoose.Schema({
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

const TextAnotation = mongoose.model('TextAnotation', TextAnotationSchema);

export default TextAnotation;
