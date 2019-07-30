import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  console.log('hello from the middleware');

  const authHeader = req.headers.authorization;

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

    req.userId = decoded.id;
    return next();
  });
};
