import mongoose from '../database/index.js';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  country: {
    type: String,
    lowercase: true,
    default: '',
  },
  state: {
    type: String,
    lowercase: true,
    default: '',
  },
  age: {
    type: String,
    lowercase: true,
    default: '',
  },
  political: {
    type: String,
    lowercase: true,
    default: '',
  },
  religious: {
    type: String,
    lowercase: true,
    default: '',
  },
  gender: {
    type: String,
    lowsercase: true,
    default: '',
  },
  sexualOrientation: {
    type: String,
    lowercase: true,
    default: '',
  },
  language: {
    type: String,
    lowercase: true,
    default: '',
  },
  education: {
    type: String,
    lowercase: true,
    default: '',
  },
  social: {
    type: String,
    lowercase: true,
    default: '',
  },
  earnings: {
    type: String,
    lowercase: true,
    default: '',
  },
  ethnicity: {
    type: String,
    lowercase: true,
    default: '',
  },
  cachedImg: {
    type: String,
    default: '',
  },
  cachedVideo: {
    type: String,
    default: '',
  },
  imageFont: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
