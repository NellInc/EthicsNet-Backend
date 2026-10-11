import bcrypt from 'bcryptjs';

const fields = [
  'firstName', 'lastName', 'email', 'country', 'state', 'age', 'political',
  'religious', 'gender', 'sexualOrientation', 'language', 'education', 'social',
  'earnings', 'ethnicity', 'cachedImg', 'cachedVideo', 'imageFont', 'password',
];

export function publicUserInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      Object.keys(body).some(key => key.startsWith('$') || key.includes('.'))) {
    throw new Error('invalid user fields');
  }
  return fields.reduce((data, field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) data[field] = body[field];
    return data;
  }, {});
}

export async function publicUserUpdate(body) {
  const data = publicUserInput(body);
  if (Object.prototype.hasOwnProperty.call(data, 'password')) {
    if (typeof data.password !== 'string' || !data.password) {
      throw new Error('password must be a nonempty string');
    }
    data.password = await bcrypt.hash(data.password, 10);
  }
  return { $set: data };
}

export function ownsAccount(req, res) {
  if (typeof req.userId !== 'string' || req.params.id !== req.userId) {
    res.status(403).send({ error: 'cannot modify another user' });
    return false;
  }
  return true;
}
