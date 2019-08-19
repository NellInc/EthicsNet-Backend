import mongoose from '../database/index.js';


const CachedImageSchema = new mongoose.Schema({
  authorId: {
    type: String,
    require: true
  }
  image: {
    type: String,
    require: true,
  },
});

const CachedImage = mongoose.model('CachedImage', CachedImageSchema);

export default CachedImage;
