import mongoose from '../database/index.js';
import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    lowercase: true
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  cachedImg: {
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
