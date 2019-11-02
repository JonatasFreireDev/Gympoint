import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  const adm = await User.findOne({
    where: { email: 'admin@gympoint.com' },
  });

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    if (decoded.id !== adm.id) {
      return res.status(401).json({ error: 'User is not Admin' });
    }
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token Invalid' });
  }
};
