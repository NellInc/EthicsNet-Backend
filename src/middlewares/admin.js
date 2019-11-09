import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('trying to authorize user...');

  if (!authHeader) {
    return res.status(401).send({ error: 'no token provided' });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'token error' });
  }

  const [scheme, token] = parts;

  // probably a problem with the regex
  // if (!/ˆBearer$ˆ/i.test(scheme)) {
  //   return res.status(401).send({ error: 'token malformatted 2' });
  // }

  jwt.verify(token, 'secret', (error, decoded) => {
    if (error) {
      return res.status(401).send({ error: 'token invalid' });
    }

    if (!decoded.isAdmin) {
      return res.status(401).send({ error: 'user is not an admin' });
    }

    console.log('decoded -> ', decoded);

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    req.user = decoded;

    return next();
  });
};
