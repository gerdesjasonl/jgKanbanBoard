import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // TODO: verify the token exists and add the user data to the request object
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ message: 'Denied Token' });
}
const token = authHeader.split(' ')[1];

try {
  const decoded =jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  req.user = decoded;
  next();
} catch (error) {
  return res.status(403).json({ message: 'Token Invalid' });
}
};
