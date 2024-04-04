import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

export function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token not found' });
  jwt.verify(token, secretKey as Secret, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    (req as any).requestUserId = user.userId;
    next();
  });
}